const {ipcRenderer} = require('electron/renderer');

const setTitle = title => ipcRenderer.send('set-title', title);

const init = directory => ipcRenderer.send('init-directory', directory);

const sendFiles = callback => {
  const cbFunction = (_event, value) => callback(value);
  ipcRenderer.on('files', cbFunction);
};

export {setTitle, sendFiles, init};
