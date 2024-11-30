// tasks.js
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task');

let tasks = [];

const tasksPath = path.join(__dirname, 'tasks.json');

// Load tasks from file
if (fs.existsSync(tasksPath)) {
  tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
  tasks.forEach(task => addTaskToList(task));
}

// Add new task
newTaskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && newTaskInput.value.trim() !== '') {
    const taskText = newTaskInput.value.trim();
    tasks.push(taskText);
    saveTasks();
    addTaskToList(taskText);
    newTaskInput.value = '';
  }
});

function addTaskToList(taskText) {
  const listItem = document.createElement('li');

  const taskSpan = document.createElement('span');
  taskSpan.textContent = taskText;

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-task';
  deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Using a trash can icon

  deleteButton.addEventListener('click', () => {
    tasks = tasks.filter(task => task !== taskText);
    saveTasks();
    listItem.remove();
  });

  listItem.appendChild(taskSpan);
  listItem.appendChild(deleteButton);

  taskList.appendChild(listItem);
}

function saveTasks() {
  fs.writeFileSync(tasksPath, JSON.stringify(tasks));
}

// Handle minimize button
const minimizeButton = document.getElementById('minimize-button');
minimizeButton.addEventListener('click', () => {
  ipcRenderer.send('minimize-window', 'tasks');
});
