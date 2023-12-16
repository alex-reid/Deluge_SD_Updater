const {ipcRenderer} = require('electron/renderer');

/**
 * @module preload
 */

export {sha256sum} from './nodeCrypto';
export {versions} from './versions';
export {setTitle} from './delugeIPC';
export const sendFiles = callback => ipcRenderer.on('files', (_event, value) => callback(value));
