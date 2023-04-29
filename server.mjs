import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

const notesPath = path.resolve(__dirname, './db/db.json');
let notes = JSON.parse(await fs.readFile(notesPath, 'utf8'));

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  const newNote = req.body;
  newNote.id = Date.now().toString();
  notes.push(newNote);
  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log("Note saved!");
  res.json(notes);
});

app.delete("/api/notes/:id", async (req, res) => {
  const noteId = req.params.id;
  notes = notes.filter((note) => note.id !== noteId);
  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log("Note deleted!");
  res.json(notes);
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});

