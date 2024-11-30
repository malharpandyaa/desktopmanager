// clipboard.js
const { ipcRenderer } = require('electron');
const { clipboard } = require('electron');
const clipboardList = document.getElementById('clipboard-list');

let clipboardHistory = [];
let deletedItems = new Set();

// Monitor clipboard changes
setInterval(() => {
  const currentText = clipboard.readText();
  if (
    currentText &&
    clipboardHistory[0] !== currentText &&
    !deletedItems.has(currentText)
  ) {
    clipboardHistory.unshift(currentText);
    addClipboardItem(currentText);
    // Optionally, clear deletedItems since a new item has been added
    deletedItems.clear();
  }
}, 1000);

function addClipboardItem(text) {
  const listItem = document.createElement('li');

  // Create a span to hold the text
  const textSpan = document.createElement('span');
  textSpan.textContent = text;

  // Create a copy button
  const copyButton = document.createElement('button');
  copyButton.className = 'copy-button';
  copyButton.innerHTML = '<i class="fas fa-leaf"></i>'; // Using a leaf icon

  copyButton.addEventListener('click', () => {
    clipboard.writeText(text);
    // Provide visual feedback (optional)
    copyButton.innerHTML = '<i class="fas fa-check"></i>'; // Change icon to a checkmark
    setTimeout(() => {
      copyButton.innerHTML = '<i class="fas fa-leaf"></i>'; // Revert to leaf icon
    }, 1000);
  });

  // Create a delete button
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-clipboard';
  deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Using a trash can icon

  deleteButton.addEventListener('click', () => {
    // Remove from clipboardHistory array
    clipboardHistory = clipboardHistory.filter(item => item !== text);
    // Add to deletedItems set
    deletedItems.add(text);
    // Remove from the DOM
    listItem.remove();
  });

  // Append elements to the list item
  listItem.appendChild(textSpan);
  listItem.appendChild(copyButton);
  listItem.appendChild(deleteButton);

  // Add the list item to the clipboard list
  clipboardList.insertBefore(listItem, clipboardList.firstChild);
}

// Handle minimize button
const minimizeButton = document.getElementById('minimize-button');
minimizeButton.addEventListener('click', () => {
  ipcRenderer.send('minimize-window', 'clipboard');
});
