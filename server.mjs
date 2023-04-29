import express from "express";
import path from "path";
import { promises as fs } from "fs";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(process.cwd(), "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(process.cwd(), "/public/notes.html"))
);

let notes;

(async () => {
  const rawData = await fs.readFile("./db/db.json", "utf-8");
  notes = JSON.parse(rawData);
})();

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  const newNote = req.body;
  newNote.id = Date.now().toString();
  notes.push(newNote);
  await fs.writeFile("./db/db.json", JSON.stringify(notes));
  console.log("Note saved!");
  res.json(notes);
});

app.delete("/api/notes/:id", async (req, res) => {
  const noteId = req.params.id;
  notes = notes.filter((note) => note.id !== noteId);
  await fs.writeFile("./db/db.json", JSON.stringify(notes));
  console.log("Note deleted!");
  res.json(notes);
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
