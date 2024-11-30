// notes.js
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const notesArea = document.getElementById('notes-area');

const notesPath = path.join(__dirname, 'notes.txt');

// Load notes from file
if (fs.existsSync(notesPath)) {
  const notes = fs.readFileSync(notesPath, 'utf8');
  notesArea.value = notes;
}

// Save notes to file
notesArea.addEventListener('input', () => {
  fs.writeFileSync(notesPath, notesArea.value);
});

// Handle minimize button
const minimizeButton = document.getElementById('minimize-button');
minimizeButton.addEventListener('click', () => {
  ipcRenderer.send('minimize-window', 'notes');
});
