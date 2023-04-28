import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
  const notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "db/db.json"), "utf8")
  );
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };

  let notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "db/db.json"), "utf8")
  );
  notes.push(newNote);

  fs.writeFileSync(
    path.join(__dirname, "db/db.json"),
    JSON.stringify(notes, null, 2)
  );

  res.json(newNote);
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
