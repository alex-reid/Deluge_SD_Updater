import {prettyName} from './utils';

function getMainDelugeInfo(D) {
  return {
    initialised: true,
    kits: D.files.kits.map(kit => ({
      path: kit.path,
      rootPath: kit.rootPath,
      oldName: kit.fileName,
      newName: kit.newName,
      rewriteName: '',
      prettyName: prettyName(kit.presetName) || '',
      presetType: kit.presetType,
      presetName: kit.presetName,
      presetFolder: kit.presetFolder,
      presetSlot: kit.presetSlot,
      presetSubSlot: kit.presetSubSlot,
    })),
    synths: D.files.synths.map(synth => ({
      path: synth.path,
      rootPath: synth.rootPath,
      oldName: synth.fileName,
      newName: synth.newName,
      rewriteName: '',
      prettyName: prettyName(synth.presetName) || '',
      presetType: synth.presetType,
      presetName: synth.presetName,
      presetFolder: synth.presetFolder,
      presetSlot: synth.presetSlot,
      presetSubSlot: synth.presetSubSlot,
    })),
    songs: D.files.songs.map(songs => ({
      name: songs.fileName,
      path: songs.path,
      instruments: songs.instruments.reduce(
        (acc, curr) => [
          ...acc,
          {
            type: curr.presetType,
            presetName: curr.presetName,
            presetFolder: curr.presetFolder,
            presetSlot: curr.presetSlot,
            presetSubSlot: curr.presetSubSlot,
          },
        ],
        [],
      ),
      clips: songs.clips.reduce(
        (acc, curr) => [
          ...acc,
          {
            type: curr.presetType,
            presetName: curr.presetName,
            presetFolder: curr.presetFolder,
            presetSlot: curr.presetSlot,
            presetSubSlot: curr.presetSubSlot,
          },
        ],
        [],
      ),
      firmwareVersion: songs.firmwareVersion,
    })),
  };
}

const sendMainDelugeInfo = (D, browserWindow) =>
  browserWindow.webContents.send('files', getMainDelugeInfo(D));

const sendErrorMain = (error, browserWindow) => browserWindow.webContents.send('send-error', error);

export {getMainDelugeInfo, sendMainDelugeInfo, sendErrorMain};
