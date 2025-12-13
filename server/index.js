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
  origin: [
    'http://localhost',
    process.env.API_CLIENT_ORIGIN
  ],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// --------------------------------------------------
// MongoDB
// --------------------------------------------------
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/code_quiz'
const PORT = process.env.PORT || 4000

await mongoose.connect(MONGO_URI)
console.log('Mongo connected')

// --------------------------------------------------
// Schemas (match seed.js EXACTLY)
// --------------------------------------------------

// Shared Question Schema
const questionSchema = new mongoose.Schema({
  id: String,
  title: String,
  code: String,
  options: [String],
  correctIndex: Number,
  explanation: String
})

// Python (collection: "python")
const Python = mongoose.model('Python', questionSchema, 'python')

// Movies (collection: "movies")
const Movie = mongoose.model('Movie', questionSchema, 'movies')

// AWS (collection: "aws")
const AWS = mongoose.model('AWS', questionSchema, 'aws')

// --------------------------------------------------
// User Schema (refs Python + Movies + AWS)
// --------------------------------------------------
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,

  correctPython: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Python' }
  ],

  correctMovies: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }
  ],

  correctAWS: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'AWS' }
  ],

  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)

// --------------------------------------------------
// Helpers
// --------------------------------------------------
function createJwt(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '30d' }
  )
}

// Auth middleware
async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.session
    if (!token) return res.status(401).json({ error: 'Not logged in' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    const user = await User.findById(decoded.userId)

    if (!user) return res.status(401).json({ error: 'Invalid user' })

    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid session' })
  }
}

// --------------------------------------------------
// Auth Routes
// --------------------------------------------------
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ email, passwordHash })

    const token = createJwt(user._id)
    res.cookie('session', token, { httpOnly: true, sameSite: 'lax' })

    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Signup failed' })
  }
})

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid email' })
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return res.status(400).json({ error: 'Invalid password' })
    }

    user.lastLoginAt = new Date()
    await user.save()

    const token = createJwt(user._id)
    res.cookie('session', token, { httpOnly: true, sameSite: 'lax' })

    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Login failed' })
  }
})

app.post('/auth/logout', (req, res) => {
  res.clearCookie('session')
  res.json({ success: true })
})

app.get('/auth/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('correctPython')
    .populate('correctMovies')
    .populate('correctAWS')

  res.json({
    email: user.email,
    correctPython: user.correctPython,
    correctMovies: user.correctMovies,
    correctAWS: user.correctAWS,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt
  })
})

// --------------------------------------------------
// PYTHON QUIZ ROUTES
// --------------------------------------------------
app.get('/api/python', async (_, res) => {
  const items = await Python.find().lean()
  res.json(items)
})

app.get('/api/python/new', requireAuth, async (req, res) => {
  const items = await Python.find({
    _id: { $nin: req.user.correctPython }
  }).lean()

  res.json(items)
})

app.post('/api/python/mark-correct', requireAuth, async (req, res) => {
  const { questionId } = req.body
  if (!questionId) {
    return res.status(400).json({ error: 'questionId required' })
  }

  if (!req.user.correctPython.includes(questionId)) {
    req.user.correctPython.push(questionId)
    await req.user.save()
  }

  res.json({ success: true })
})

// --------------------------------------------------
// MOVIE QUIZ ROUTES
// --------------------------------------------------
app.get('/api/movies', async (_, res) => {
  const items = await Movie.find().lean()
  res.json(items)
})

app.get('/api/movies/new', requireAuth, async (req, res) => {
  const items = await Movie.find({
    _id: { $nin: req.user.correctMovies }
  }).lean()

  res.json(items)
})

app.post('/api/movies/mark-correct', requireAuth, async (req, res) => {
  const { movieId } = req.body
  if (!movieId) {
    return res.status(400).json({ error: 'movieId required' })
  }

  if (!req.user.correctMovies.includes(movieId)) {
    req.user.correctMovies.push(movieId)
    await req.user.save()
  }

  res.json({ success: true })
})

// --------------------------------------------------
// AWS QUIZ ROUTES
// --------------------------------------------------
app.get('/api/aws', async (_, res) => {
  const items = await AWS.find().lean()
  res.json(items)
})

app.get('/api/aws/new', requireAuth, async (req, res) => {
  const items = await AWS.find({
    _id: { $nin: req.user.correctAWS }
  }).lean()

  res.json(items)
})

app.post('/api/aws/mark-correct', requireAuth, async (req, res) => {
  const { awsId } = req.body
  if (!awsId) {
    return res.status(400).json({ error: 'awsId required' })
  }

  if (!req.user.correctAWS.includes(awsId)) {
    req.user.correctAWS.push(awsId)
    await req.user.save()
  }

  res.json({ success: true })
})

// --------------------------------------------------
// Start server
// --------------------------------------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on http://0.0.0.0:${PORT}`)
})
