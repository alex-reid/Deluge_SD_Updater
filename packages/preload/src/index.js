const {ipcRenderer} = require('electron/renderer');

/**
 * @module preload
 */

ipcRenderer.removeAllListeners();
export {setTitle} from './delugeIPC';
export {sha256sum} from './nodeCrypto';
export {versions} from './versions';
export const init = directory => ipcRenderer.send('init-directory', directory);
export const sendFiles = callback => ipcRenderer.on('files', (_event, value) => callback(value));
export const sendError = callback => {
  console.log('sendError handler added');
  ipcRenderer.on('send-error', (e, value) => callback(value));
};
