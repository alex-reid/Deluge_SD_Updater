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
      songIDs: Array.from(kit.songIDs),
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
      songIDs: Array.from(synth.songIDs),
    })),
    songs: D.files.songs.map(song => {
      return {
        name: song.fileName,
        path: song.path,
        clipsLength: song.clips.length,
        firmwareVersion: song.firmwareVersion,
        shouldUpdate: true,
        previewData: song.previewData,
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
              patchSuffix: curr.patchSuffixClean,
              patchSuffixOld: curr.patchSuffix,
              usedInClips: song.getInstrumentClipIndexs(curr),
              rewriteName: curr.rewriteName,
              rewriteFolder: curr.rewriteFolder,
              prettyName: prettyName(curr.patchName) + curr.patchSuffixClean || '',
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
