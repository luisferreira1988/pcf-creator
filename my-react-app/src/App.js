import React, { useState } from 'react';
import './App.css';
const { ipcRenderer } = window.require('electron');

function App() {
  const [folderPath, setFolderPath] = useState('');

  const handleSelectFolderClick = () => {
    ipcRenderer.send('open-directory-dialog');
  };

  ipcRenderer.on('selected-directory', (event, path) => {
    setFolderPath(path);
  });

  const handleCreateFolderClick = () => {
    if (folderPath) {
      ipcRenderer.send('create-folder', folderPath);
    }
  };

  return (
    <div className="App">
      <button onClick={handleSelectFolderClick}>Select Folder</button>
      <input type="text" readOnly value={folderPath} />
      <button onClick={handleCreateFolderClick}>Create Folder</button>
    </div>
  );
}

export default App;
