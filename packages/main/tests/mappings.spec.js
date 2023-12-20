import {afterAll, beforeAll, expect, test} from 'vitest';
import fileSystem from '../src/delugefs/fileSystemClass';
import path from 'path';
import {getMainDelugeInfo} from '../src/delugefs/ipcFuncs';
import {output} from './IPCout';

let Deluge;
const testfolder = path.resolve('./', 'packages', 'main', 'tests');
const dummySDCard = path.join(testfolder, 'dummySDCard');

beforeAll(() => {
  Deluge = new fileSystem();
});

afterAll(() => {
  Deluge = null;
});

test('filesystem exists', () => {
  const instance = new fileSystem();
  expect(typeof instance == 'object', 'filesystem exists');
});

test('init on blank', async () => {
  const instance = new fileSystem();
  expect.assertions(1);
  try {
    await instance.init();
  } catch (err) {
    expect(err.message).toBe('path given is not a directory');
  }
});

test('init on file', async () => {
  const instance = new fileSystem();
  expect.assertions(1);
  try {
    await instance.init(path.join(testfolder, 'blank.txt'), {
      renameToV4: true,
      prettyNames: false,
    });
  } catch (err) {
    expect(err.message).toBe('path given is not a directory');
  }
});

test('init on non-deluge directory', async () => {
  const instance = new fileSystem();
  expect.assertions(1);
  try {
    await instance.init(path.join(testfolder, 'emptyfolder'), {
      renameToV4: true,
      prettyNames: false,
    });
  } catch (err) {
    expect(err.message).toBe("can't find deluge paths");
  }
});

test('sucessful init', () => {
  return Deluge.init(dummySDCard, {
    renameToV4: true,
    prettyNames: false,
  }).then(() => {
    expect(Deluge.isDelugeDrive).toBe(true);
    expect(Deluge.rootDir).toBe(dummySDCard);
    expect(Deluge.files.kits.length).toBe(4);
    expect(Deluge.files.synths.length).toBe(12);
    expect(Deluge.files.songs.length).toBe(4);
  });
});

test('check song mappings', () => {
  expect(getMainDelugeInfo(Deluge)).toEqual(output);
});

test('validate each song', () => {
  Deluge.files.songs.forEach(song => {
    expect(song.validate()).toBe(true);
  });
});

test('fail on bad array length', () => {
  expect(() => {
    Deluge.files.songs.forEach(song => {
      const newNames = [];
      song.rewriteInstrumentsAndClipsXMLAttributes(newNames);
    });
  }).toThrow('new names are not the same length as instruments');
});

test('fail on bad array data', () => {
  expect(() => {
    Deluge.files.songs.forEach(song => {
      const newNames = new Array(song.instruments.length).fill({
        rewriteName: false,
        rewriteFolder: 'test folder ',
      });
      song.rewriteInstrumentsAndClipsXMLAttributes(newNames);
    });
  }).toThrow('invalid data in new names array');
});

test('test rewrite each song', () => {
  expect(() => {
    Deluge.files.songs.forEach(song => {
      const newNames = song.instruments.map((_v, index) => ({
        rewriteName: 'test name ' + index,
        rewriteFolder: 'test folder ' + index,
      }));
      song.rewriteInstrumentsAndClipsXMLAttributes(newNames);
    });
  }).not.toThrow();
});

test('find test names in songs', () => {
  Deluge.files.songs.forEach(song => {
    song.instruments.forEach((instrument, index) => {
      expect(instrument.presetName).toBe('test name ' + index);
      expect(instrument.presetFolder).toBe('test folder ' + index);
      expect(instrument.presetSlot).toBeNull;
      expect(instrument.presetSubSlot).toBeNull;
    });
  });
});

test('find test names in clips', () => {
  Deluge.files.songs.forEach(song => {
    song.instruments.forEach((instrument, index) => {
      instrument.clips.forEach(clipId => {
        const clip = song.clips[clipId];
        expect(clip.presetName).toBe('test name ' + index);
        expect(clip.presetFolder).toBe('test folder ' + index);
        expect(clip.presetSlot).toBeNull;
        expect(clip.presetSubSlot).toBeNull;
      });
    });
  });
});

test('no old tags in clips', () => {
  Deluge.files.songs.forEach(song => {
    song.clips.forEach(clip => {
      expect(clip.presetSlot).toBeNull;
      expect(clip.presetSubSlot).toBeNull;
    });
  });
});
