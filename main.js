// main.js
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let windows = {
  clipboard: null,
  notes: null,
  tasks: null,
};

let minimizedWindows = {
  clipboard: false,
  notes: false,
  tasks: false,
};

let sidebarWindow;

function createWindow(windowName, fileName, yPosition, windowHeight) {
  windows[windowName] = new BrowserWindow({
    width: 300,
    height: windowHeight,
    x: 0,
    y: yPosition,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true, // Consider setting to false in production
      contextIsolation: false, // Set to true and adjust code in production
    },
  });

  windows[windowName].loadFile(fileName);
  windows[windowName].setMenuBarVisibility(false);

  windows[windowName].on('closed', () => {
    windows[windowName] = null;
    sidebarWindow.webContents.send('window-closed', windowName);
  });
}

function createSidebar() {
  const display = screen.getPrimaryDisplay();
  const { height } = display.workAreaSize;

  sidebarWindow = new BrowserWindow({
    width: 50,
    height: height,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true, // Consider setting to false in production
      contextIsolation: false, // Set to true and adjust code in production
    },
  });

  sidebarWindow.loadFile('sidebar.html');
  sidebarWindow.setMenuBarVisibility(false);
}

function minimizeWindow(windowName) {
  if (windows[windowName]) {
    windows[windowName].hide();
    minimizedWindows[windowName] = true;
    sidebarWindow.webContents.send('window-minimized', windowName);
  }
}

function restoreWindow(windowName) {
  if (windows[windowName]) {
    windows[windowName].show();
    minimizedWindows[windowName] = false;
    sidebarWindow.webContents.send('window-restored', windowName);
  }
}

app.whenReady().then(() => {
  createSidebar();

  const display = screen.getPrimaryDisplay();
  const { height } = display.workAreaSize;
  const windowHeight = height / 3;

  createWindow('clipboard', 'clipboard.html', 0, windowHeight);
  createWindow('notes', 'notes.html', windowHeight, windowHeight);
  createWindow('tasks', 'tasks.html', windowHeight * 2, windowHeight);

  // IPC listeners
  ipcMain.on('minimize-window', (event, windowName) => {
    minimizeWindow(windowName);
  });

  ipcMain.on('restore-window', (event, windowName) => {
    restoreWindow(windowName);
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
