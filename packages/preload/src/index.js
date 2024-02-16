const {ipcRenderer} = require('electron/renderer');

/**
 * @module preload
 */

ipcRenderer.removeAllListeners();
export {sha256sum} from './nodeCrypto';
export {versions} from './versions';
export const init = directory => ipcRenderer.send('init-directory', directory);
export const exportFiles = files => ipcRenderer.send('export-files', files);
export const openBroswer = () => ipcRenderer.send('open-browser');
export const sendFiles = callback => ipcRenderer.on('files', (_event, value) => callback(value));
export const sendFileUpdates = callback =>
  ipcRenderer.on('export-update-results', (_event, value) => callback(value));
export const sendFileUpdatesOff = () => ipcRenderer.removeAllListeners('export-update-results');
export const sendError = callback => {
  console.log('sendError handler added');
  ipcRenderer.on('send-error', (e, value) => callback(value));
};
