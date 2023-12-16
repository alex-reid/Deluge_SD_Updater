const {ipcRenderer} = require('electron/renderer');

const setTitle = title => ipcRenderer.send('set-title', title);

const sendFiles = callback => ipcRenderer.on('files', (_event, value) => callback(value));

export {setTitle, sendFiles};
