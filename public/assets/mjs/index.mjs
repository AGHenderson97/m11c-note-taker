import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/notes', (req, res) => {
  // Read the existing notes from db.json file
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  // Read the existing notes from db.json file
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

  // Create a new note object with a unique id
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };

  // Add the new note to the notes array
  notes.push(newNote);

  // Write the updated notes array back to the db.json file
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));

  // Send the new note object back to the client
  res.json(newNote);
});

// HTML Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/public/notes.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

