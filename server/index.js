import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// 1) Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/code_quiz'
const PORT = process.env.PORT || 4000

await mongoose.connect(MONGO_URI)

// 2) Define Question schema
const questionSchema = new mongoose.Schema({
  language: String,
  title: String,
  code: String,
  options: [String],
  correctIndex: Number,
  explanation: String
})

const Question = mongoose.model('Question', questionSchema)

// 3) Routes
app.get('/api/questions', async (req, res) => {
  const { language } = req.query
  const query = language ? { language } : {}
  const questions = await Question.find(query).lean()
  res.json(questions)
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
