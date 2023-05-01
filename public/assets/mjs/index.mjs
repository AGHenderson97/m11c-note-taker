import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const app = express();
const PORT = process.env.PORT || 5501;

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
  const apiData = await fetch('/api/notes');
  const data = await apiData.json();
  res.json(data);
});

app.post("/api/notes", async (req, res) => {
  const apiResponse = await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  });

  const data = await apiResponse.json();
  res.json(data);
});

app.delete("/api/notes/:id", async (req, res) => {
  const noteId = req.params.id;
  const apiResponse = await fetch(`/api/notes/${noteId}`, {
    method: 'DELETE',
  });
  const data = await apiResponse.json();
  res.json(data);
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
