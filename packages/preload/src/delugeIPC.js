const {ipcRenderer} = require('electron/renderer');

const setTitle = title => ipcRenderer.send('set-title', title);

export {setTitle};
