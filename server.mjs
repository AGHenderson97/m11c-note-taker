import { createRequire } from "module";
const require = createRequire(import.meta.url);

const fs = require("fs");
const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Log each request to the console
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  console.log(`Received POST request with data: ${JSON.stringify(req.body)}`);
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text
  };
  let notes = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
  notes.push(newNote);
  fs.writeFileSync("db/db.json", JSON.stringify(notes));
  res.json(newNote);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
