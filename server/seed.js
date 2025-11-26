import mongoose from 'mongoose'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/code_quiz'
await mongoose.connect(MONGO_URI)

const questionSchema = new mongoose.Schema({
  language: String,
  title: String,
  code: String,
  options: [String],
  correctIndex: Number,
  explanation: String
})

const Question = mongoose.model('Question', questionSchema)

// Load JSON from /server/questions/python.json
const filePath = join(__dirname, 'questions', 'python.json')
const data = JSON.parse(readFileSync(filePath, 'utf-8'))

await Question.deleteMany({ language: 'python' })
await Question.insertMany(data.map(q => ({ ...q, language: 'python' })))

console.log('Seeded Python questions')
process.exit(0)
