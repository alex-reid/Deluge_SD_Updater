import {prettyName} from './utils';

function getMainDelugeInfo(D) {
  return {
    initialised: true,
    kits: D.files.kits.map(kit => ({
      id: kit.soundID,
      path: kit.path,
      rootPath: kit.rootPath,
      rewriteName: '',
      oldName: kit.fileName,
      newName: kit.newName,
      prettyName: prettyName(kit.presetName) || '',
      presetType: kit.presetType,
      presetName: kit.presetName,
      songIDs: Array.from(kit.songIDs),
      sound: kit.sound,
    })),
    synths: D.files.synths.map(synth => ({
      id: synth.soundID,
      path: synth.path,
      rootPath: synth.rootPath,
      rewriteName: '',
      oldName: synth.fileName,
      newName: synth.newName,
      prettyName: prettyName(synth.presetName) || '',
      presetType: synth.presetType,
      presetName: synth.presetName,
      songIDs: Array.from(synth.songIDs),
      sound: synth.sound,
    })),
    songs: D.files.songs.map(song => {
      return {
        id: song.songID,
        name: song.fileName,
        path: song.path,
        clipsLength: song.clips.length,
        firmwareVersion: song.firmwareVersion,
        shouldUpdate: true,
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
              sound: curr.sound,
              usedInClips: song.getInstrumentClipIndexs(curr),
              rewriteName: curr.rewriteName,
              rewriteFolder: curr.rewriteFolder,
              prettyName: prettyName(curr.sound.baseName) + curr.sound.suffixV4 || '',
              soundID: curr.soundID,
              isNewSound: curr.soundID == 'new',
            },
          ],
          [],
        ),
      };
    }),
  };
}

const sendMainDelugeInfo = (D, browserWindow) =>
  browserWindow.webContents.send('files', getMainDelugeInfo(D));

const sendErrorMain = (error, browserWindow) => browserWindow.webContents.send('send-error', error);

export {getMainDelugeInfo, sendMainDelugeInfo, sendErrorMain};
