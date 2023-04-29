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

async function readNotes() {
  const rawData = await fs.readFile(notesPath, 'utf8');
  return JSON.parse(rawData);
}

app.get("/api/notes", async (req, res) => {
  res.json(await readNotes());
});

app.post("/api/notes", async (req, res) => {
  const newNote = req.body;
  newNote.id = Date.now().toString();
  const notes = await readNotes();
  notes.push(newNote);
  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log("Note saved!");
  res.json(notes);
});

app.delete("/api/notes/:id", async (req, res) => {
  const noteId = req.params.id;
  let notes = await readNotes();
  notes = notes.filter((note) => note.id !== noteId);
  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log("Note deleted!");
  res.json(notes);
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});

