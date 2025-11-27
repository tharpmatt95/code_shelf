import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()

// --------------------------------------------------
// Middleware
// --------------------------------------------------
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// --------------------------------------------------
// 1) Connect to MongoDB
// --------------------------------------------------
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/code_quiz'
const PORT = process.env.PORT || 4000

await mongoose.connect(MONGO_URI)
console.log("Mongo connected")

// --------------------------------------------------
// 2) Question schema
// --------------------------------------------------
const questionSchema = new mongoose.Schema({
  language: String,
  title: String,
  code: String,
  options: [String],
  correctIndex: Number,
  explanation: String
})

const Question = mongoose.model('Question', questionSchema)

// --------------------------------------------------
// 3) User schema
// --------------------------------------------------
const userSchema = new mongoose.Schema({
  googleId: { type: String, index: true },

  email: { type: String, unique: true },
  passwordHash: { type: String },

  correctQuestions: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
  ],

  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)

// --------------------------------------------------
// 4) JWT helper
// --------------------------------------------------
function createJwt(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '30d' }
  )
}

// --------------------------------------------------
// 5) Auth routes (must be above other routes)
// --------------------------------------------------

// Signup
app.post('/auth/signup', async (req, res) => {
  console.log('SIGNUP: start')

  try {
    const { email, password } = req.body

    console.log('SIGNUP: checking existing')
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already exists' })

    console.log('SIGNUP: hashing')
    const passwordHash = await bcrypt.hash(password, 10)

    console.log('SIGNUP: creating user')
    const user = await User.create({ email, passwordHash })

    console.log('SIGNUP: making token')
    const token = createJwt(user._id)

    console.log('SIGNUP: sending cookie')
    res.cookie('session', token, { httpOnly: true, sameSite: 'lax' })

    console.log('SIGNUP: done')
    res.json({ success: true })

  } catch (err) {
    console.log('SIGNUP ERROR:', err)
    res.status(500).json({ error: 'Signup failed' })
  }
})

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Invalid email' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(400).json({ error: 'Invalid password' })

    user.lastLoginAt = new Date()
    await user.save()

    const token = createJwt(user._id)

    res.cookie('session', token, { httpOnly: true, sameSite: 'lax' })
    res.json({ success: true })

  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// Logout
app.post('/auth/logout', (req, res) => {
  res.clearCookie('session')
  res.json({ success: true })
})

// --------------------------------------------------
// 6) Auth middleware
// --------------------------------------------------
async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.session
    if (!token) return res.status(401).json({ error: 'Not logged in' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    const user = await User.findById(decoded.userId)
    if (!user) return res.status(401).json({ error: 'User not found' })

    req.user = user
    next()

  } catch (err) {
    return res.status(401).json({ error: 'Invalid session' })
  }
}

app.get('/auth/me', requireAuth, async (req, res) => {
  res.json({
    email: req.user.email,
    correctQuestions: req.user.correctQuestions,
    createdAt: req.user.createdAt,
    lastLoginAt: req.user.lastLoginAt
  })
})


// --------------------------------------------------
// 7) Test route (for debugging)
// --------------------------------------------------
app.post('/test', (req, res) => {
  console.log('HIT TEST ROUTE')
  res.json({ ok: true })
})

// --------------------------------------------------
// 8) New questions (only unseen)
// --------------------------------------------------
app.get('/api/questions/new', requireAuth, async (req, res) => {
  const correctIds = req.user.correctQuestions

  const questions = await Question.find({
    _id: { $nin: correctIds }
  }).lean()

  res.json(questions)
})

// --------------------------------------------------
// 9) Mark correct
// --------------------------------------------------
app.post('/api/questions/mark-correct', requireAuth, async (req, res) => {
  const { questionId } = req.body

  if (!questionId) return res.status(400).json({ error: 'questionId required' })

  if (!req.user.correctQuestions.includes(questionId)) {
    req.user.correctQuestions.push(questionId)
    await req.user.save()
  }

  res.json({ success: true })
})

// --------------------------------------------------
// 10) Get questions (base)
// --------------------------------------------------
app.get('/api/questions', async (req, res) => {
  const { language } = req.query
  const query = language ? { language } : {}
  const questions = await Question.find(query).lean()
  res.json(questions)
})

// --------------------------------------------------
// 11) Start server
// --------------------------------------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on http://0.0.0.0:${PORT}`)
})
