import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import fs from 'fs';
import path from 'path';
import isDev from 'electron-is-dev';

// Function to create a folder
function createFolder(folderPath) {
  // Use fs.mkdirSync to create the folder; { recursive: true } means it will create parent directories if they don't exist
  try {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Folder created at ${folderPath}`);
  } catch (err) {
      console.error(`An error occurred creating the folder: ${err.message}`);
  }
}

// Set up IPC listener for folder creation
ipcMain.on('create-folder', (event, folderPath) => {
  createFolder(folderPath);
});

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // You might not need to enable nodeIntegration depending on your app's requirements
      // If you do not enable it, you will have to use contextBridge to expose
      // any Node.js functionality to your renderer process
    },
  });

  // and load the index.html of the app.
  // Check if we are in development or production mode
  const url = isDev
    ? 'http://localhost:3000' // If in development, load from the local dev server
    : `file://${path.join(__dirname, '../my-react-app/build/index.html')}`; // If in production, load the built file
  win.loadURL(url);
  
  // Open the DevTools automatically if developing
  if (isDev) {
    win.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC listener to open folder dialog
ipcMain.on('open-directory-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then(result => {
    if (!result.canceled && result.filePaths && result.filePaths[0]) {
      event.reply('selected-directory', result.filePaths[0]);
    }
  }).catch(err => {
    console.log(err);
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
