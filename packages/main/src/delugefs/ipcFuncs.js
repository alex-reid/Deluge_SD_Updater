import {prettyName} from './utils';

function getMainDelugeInfo(D) {
  return {
    initialised: true,
    kits: D.files.kits.map(kit => ({
      path: kit.path,
      rootPath: kit.rootPath,
      rewriteName: '',
      oldName: kit.fileName,
      newName: kit.newName,
      prettyName: prettyName(kit.presetName) || '',
      presetType: kit.presetType,
      presetName: kit.presetName,
      presetFolder: kit.presetFolder,
    })),
    synths: D.files.synths.map(synth => ({
      path: synth.path,
      rootPath: synth.rootPath,
      rewriteName: '',
      oldName: synth.fileName,
      newName: synth.newName,
      prettyName: prettyName(synth.presetName) || '',
      presetType: synth.presetType,
      presetName: synth.presetName,
      presetFolder: synth.presetFolder,
    })),
    songs: D.files.songs.map(song => {
      return {
        name: song.fileName,
        path: song.path,
        instruments: song.instruments.reduce(
          (acc, curr) => [
            ...acc,
            {
              type: curr.presetType,
              presetName: curr.presetName,
              presetFolder: curr.presetFolder,
              presetSlot: curr.presetSlot,
              presetSubSlot: curr.presetSubSlot,
              formatType: curr.formatType,
              patchName: curr.patchName,
              usedInClips: song.getInstrumentClipIndexs(curr),
            },
          ],
          [],
        ),
        clipsLength: song.clips.length,
        firmwareVersion: song.firmwareVersion,
      };
    }),
  };
}

const sendMainDelugeInfo = (D, browserWindow) =>
  browserWindow.webContents.send('files', getMainDelugeInfo(D));

const sendErrorMain = (error, browserWindow) => browserWindow.webContents.send('send-error', error);

export {getMainDelugeInfo, sendMainDelugeInfo, sendErrorMain};
