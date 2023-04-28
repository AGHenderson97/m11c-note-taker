import express from "express";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const fs = require("fs");
const notes = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = Date.now().toString();
  notes.push(newNote);
  fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
    if (err) throw err;
    console.log("Note saved!");
  });
  res.json(notes);
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  const filteredNotes = notes.filter((note) => note.id !== noteId);
  fs.writeFile("./db/db.json", JSON.stringify(filteredNotes), function (err) {
    if (err) throw err;
    console.log("Note deleted!");
  });
  res.json(filteredNotes);
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
