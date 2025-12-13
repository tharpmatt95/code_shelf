import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// -------------------------------------------------------------
// Resolve __dirname (ESM compatible)
// -------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// -------------------------------------------------------------
// Mongo connection
// -------------------------------------------------------------
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://mongo:27017/code_quiz";

await mongoose.connect(MONGO_URI);
const db = mongoose.connection;

// -------------------------------------------------------------
// Cleanup unwanted collections
// -------------------------------------------------------------
const keep = new Set(["users", "python", "movies", "aws"]);
const collections = await db.db.listCollections().toArray();

for (const col of collections) {
  if (!keep.has(col.name)) {
    await db.dropCollection(col.name);
  }
}

// -------------------------------------------------------------
// Shared question schema
// -------------------------------------------------------------
const questionSchema = new mongoose.Schema({
  id: String,
  title: String,
  code: String,
  options: [String],
  correctIndex: Number,
  explanation: String
});

// -------------------------------------------------------------
// Python model (collection: "python")
// -------------------------------------------------------------
const Python = mongoose.model(
  "Python",
  questionSchema,
  "python"
);

// -------------------------------------------------------------
// Movies model (collection: "movies")
// -------------------------------------------------------------
const Movie = mongoose.model(
  "Movie",
  questionSchema,
  "movies"
);

// -------------------------------------------------------------
// AWS model (collection: "aws")
// -------------------------------------------------------------
const AWS = mongoose.model(
  "AWS",
  questionSchema,
  "aws"
);

// -------------------------------------------------------------
// Helper: insert only missing items
// -------------------------------------------------------------
async function insertMissing(Model, jsonData) {
  const existing = await Model.find({}, { id: 1 }).lean();
  const existingIds = new Set(existing.map(x => x.id));

  const missing = jsonData.filter(
    entry => !existingIds.has(entry.id)
  );

  if (missing.length > 0) {
    console.log(
      `Inserting ${missing.length} items into ${Model.collection.name}`
    );
    await Model.insertMany(missing);
  } else {
    console.log(
      `No new items to insert for ${Model.collection.name}`
    );
  }
}

// -------------------------------------------------------------
// Seed Python
// -------------------------------------------------------------
const pythonFile = join(__dirname, "questions", "python.json");
const pythonData = JSON.parse(readFileSync(pythonFile, "utf-8"));
await insertMissing(Python, pythonData);

// -------------------------------------------------------------
// Seed Movies
// -------------------------------------------------------------
const moviesFile = join(__dirname, "questions", "movies.json");
const moviesData = JSON.parse(readFileSync(moviesFile, "utf-8"));
await insertMissing(Movie, moviesData);

// -------------------------------------------------------------
// Seed AWS
// -------------------------------------------------------------
const awsFile = join(__dirname, "questions", "aws.json");
const awsData = JSON.parse(readFileSync(awsFile, "utf-8"));
await insertMissing(AWS, awsData);

// -------------------------------------------------------------
process.exit(0);
