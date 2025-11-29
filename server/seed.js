import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// -------------------------------------------------------------
// Resolve __dirname
// -------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// -------------------------------------------------------------
// Mongo connection
// -------------------------------------------------------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/code_quiz";
await mongoose.connect(MONGO_URI);
const db = mongoose.connection;

// -------------------------------------------------------------
// Cleanup unwanted collections
// -------------------------------------------------------------
const keep = new Set(["users", "python", "movies"]);
const collections = await db.db.listCollections().toArray();

for (const col of collections) {
  if (!keep.has(col.name)) {
    await db.dropCollection(col.name);
  }
}

// -------------------------------------------------------------
// Python model  (collection: "python")
// -------------------------------------------------------------
const pythonSchema = new mongoose.Schema({
  id: String,
  title: String,
  code: String,
  options: [String],
  correctIndex: Number,
  explanation: String
});

const Python = mongoose.model("Python", pythonSchema, "python");

// -------------------------------------------------------------
// Movies model  (collection: "movies")
// -------------------------------------------------------------
const movieSchema = new mongoose.Schema({
  id: String,
  title: String,
  code: String,
  options: [String],
  correctIndex: Number,
  explanation: String
});

const Movie = mongoose.model("Movie", movieSchema, "movies");

// -------------------------------------------------------------
// Seed Python
// -------------------------------------------------------------
const pythonFile = join(__dirname, "questions", "python.json");
const pythonData = JSON.parse(readFileSync(pythonFile, "utf-8"));

if (await Python.countDocuments() === 0) {
  await Python.insertMany(pythonData);
}

// -------------------------------------------------------------
// Seed Movies
// -------------------------------------------------------------
const moviesFile = join(__dirname, "questions", "movies.json");
const moviesData = JSON.parse(readFileSync(moviesFile, "utf-8"));

if (await Movie.countDocuments() === 0) {
  await Movie.insertMany(moviesData);
}

process.exit(0);
