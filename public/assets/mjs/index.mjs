const noteList = document.querySelector('.list-group');

// Function to handle the creation of a new note
const handleNewNote = () => {
  window.location.href = '/notes';
};

// Function to handle the saving of a note
const handleNoteSave = async () => {
  const titleEl = document.querySelector('.note-title');
  const textEl = document.querySelector('.note-textarea');

  if (titleEl.value === '' || textEl.value === '') {
    alert('Please enter a title and note text');
    return;
  }

  const note = {
    title: titleEl.value,
    text: textEl.value,
  };

  try {
    const response = await saveNote(note);
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    window.location.href = '/notes';
  } catch (err) {
    console.error(err);
    alert('Failed to save note');
  }
};

// Function to handle the deletion of a note
const handleNoteDelete = async (event) => {
  event.stopPropagation();
  const note = event.target.parentNode.dataset.note;
  const noteObj = JSON.parse(note);

  if (confirm(`Are you sure you want to delete "${noteObj.title}"`)) {
    try {
      const response = await deleteNote(noteObj.id);
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      getNotes().then(renderNoteList);
    } catch (err) {
      console.error(err);
      alert('Failed to delete note');
    }
  }
};

// Function to handle the viewing of a note
const handleNoteView = (event) => {
  event.stopPropagation();
  const note = event.target.dataset.note;
  const noteObj = JSON.parse(note);
  const titleEl = document.querySelector('.note-title');
  const textEl = document.querySelector('.note-textarea');

  titleEl.value = noteObj.title;
  textEl.value = noteObj.text;
};

// Function to render list of notes
const loadNotes = async () => {
  try {
    const response = await getNotes();
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    renderNoteList(response);
  } catch (err) {
    console.error(err);
    alert('Failed to load notes');
  }
};

// Attach event listeners
document.querySelector('.new-note').addEventListener('click', handleNewNote);
document.querySelector('.save-note').addEventListener('click', handleNoteSave);
noteList.addEventListener('click', handleNoteView);
noteList.addEventListener('click', handleNoteDelete);

// Load notes
loadNotes();
