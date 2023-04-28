const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for handling POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets
app.use(express.static("public"));

// API routes

// GET all notes
app.get("/api/notes", (req, res) => {
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, "db/db.json"), "utf8"));
  res.json(notes);
});

// POST a new note
app.post("/api/notes", (req, res) => {
  const newNote = {
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text
  };

  let notes = JSON.parse(fs.readFileSync(path.join(__dirname, "db/db.json"), "utf8"));
  notes.push(newNote);

  fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(notes));

  res.json(newNote);
});

// HTML routes

// GET notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// GET home page
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
