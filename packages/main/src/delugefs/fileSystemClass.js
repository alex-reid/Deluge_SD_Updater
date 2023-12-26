import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import {Song, Kit, Synth} from './filesClass';
import {sendErrorMain} from './ipcFuncs';

class fileSystem {
  constructor(browser) {
    this.browserWindow = browser;
    this.driveList = null;
    this.rootDir = null;
    this.isDelugeDrive = false;
    this.delugePaths = null;
    this.renameToV4 = true;
    this.prettyNames = false;
    this.files = {
      kits: [],
      synths: [],
      songs: [],
      samples: [],
    };
    this.mappings = {
      byName: {
        kits: {},
        synths: {},
      },
    };
  }

  sendError(error) {
    sendErrorMain(error, this.browserWindow);
  }

  getFileByName(name, type) {
    return this.files[type].find(file => name == file.fileName);
  }

  getSong(name) {
    return this.getFileByName(name, 'songs');
  }
  getSynth(name) {
    return this.getFileByName(name, 'synths');
  }
  getKit(name) {
    return this.getFileByName(name, 'kits');
  }

  reset() {
    this.driveList = null;
    this.rootDir = null;
    this.isDelugeDrive = false;
    this.delugePaths = null;
    this.renameToV4 = true;
    this.prettyNames = false;
    this.files = {
      kits: [],
      synths: [],
      songs: [],
      samples: [],
    };
    this.mappings = {
      byName: {
        kits: {},
        synths: {},
      },
    };
  }

  async init(delugeSdPath, options) {
    try {
      if (!fsSync.lstatSync(delugeSdPath).isDirectory()) {
        throw new Error();
      }
    } catch {
      throw new Error('path given is not a directory');
    }

    this.reset();
    this.rootDir = delugeSdPath;
    this.renameToV4 = !!options.renameToV4;
    this.prettyNames = !!options.prettyNames;

    await this.isDelugeSD()
      .then(() => {
        return this.buildSynthsAndKitsList();
      })
      .then(() => {
        return this.buildSongList();
      })
      .then(() => {
        return this.loadSongs();
      })
      .then(() => {
        return this.mapSongInstrumentsToSounds();
      })
      .then(() => {
        return 'ready';
      })
      .catch(err => console.error(err));
  }

  async isDelugeSD() {
    await fs.readdir(this.rootDir, {withFileTypes: true}).then(files => {
      const dirs = files.reduce((a, c) => {
        c.isDirectory() && a.push(c.name);
        return a;
      }, []);

      this.isDelugeDrive = ['KITS', 'SAMPLES', 'SYNTHS'].every(v => dirs.includes(v));
      if (this.isDelugeDrive) {
        this.addPaths();
        return;
      } else {
        throw new Error("can't find deluge paths");
      }
    });
  }

  addPaths() {
    this.delugePaths = {
      songs: path.join(this.rootDir, 'SONGS'),
      kits: path.join(this.rootDir, 'KITS'),
      samples: path.join(this.rootDir, 'SAMPLES'),
      synths: path.join(this.rootDir, 'SYNTHS'),
    };
  }

  async listDirectory(path) {
    let output = false;
    await fs.readdir(path, {withFileTypes: true}).then(files => {
      output = files.reduce(
        (acc, file) =>
          !file.name.startsWith('.') && !file.isDirectory() ? [...acc, file.name] : acc,
        [],
      );
    });
    return output;
  }

  listDirectoryRecursive(delugePath) {
    let output = [];
    const files = fsSync.readdirSync(delugePath, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (!file.name.startsWith('.') && !file.isDirectory())
        output.push({name: file.name, directory: delugePath});
      if (file.isDirectory()) {
        output.push(...this.listDirectoryRecursive(path.join(delugePath, file.name)));
      }
    }
    return output;
  }

  loopDirectoryRecursive(path, callback = () => {}) {
    const files = this.listDirectoryRecursive(path);
    if (files.length > 0) {
      if (typeof callback == 'function') {
        for (let index = 0; index < files.length; index++) {
          const {name, directory} = files[index];
          callback(name, directory);
        }
      } else {
        console.error('callback must be a function');
      }
    } else {
      console.log('directory', path, 'is empty');
    }
  }

  soundSortFunc(a, b) {
    const names = a.presetName.localeCompare(b.presetName, 'en', {numeric: true});
    const folders = a.path.localeCompare(b.path, 'en', {numeric: true});
    return folders == 0 ? names : folders;
  }

  async buildSynthsAndKitsList() {
    // Loop through kits directory and add Kits
    this.loopDirectoryRecursive(this.delugePaths.kits, (file, directory) => {
      const sound = new Kit(directory, file, this.rootDir);
      this.files.kits.push(sound);
    });
    // Sort Kits alphanumerically by folder -> name
    this.files.kits.sort(this.soundSortFunc);
    // map kit names and folders & add id
    this.files.kits.forEach((sound, index) => {
      sound.soundID = index;
      this.addNewMappings(sound, 'kits', index);
    });
    console.log(this.files.kits.length, 'kits(s) loaded from SD card');
    // Loop through synths directory and add Synths
    this.loopDirectoryRecursive(this.delugePaths.synths, (file, directory) => {
      const sound = new Synth(directory, file, this.rootDir);
      this.files.synths.push(sound);
    });
    // Sort Synths alphanumerically by folder -> name
    this.files.synths.sort(this.soundSortFunc);
    // map synth names and folders & add id
    this.files.synths.forEach((sound, index) => {
      sound.soundID = index;
      this.addNewMappings(sound, 'synths', index);
    });
    console.log(this.files.synths.length, 'synths(s) loaded from SD card');
  }

  addNewMappings(sound, type, index = 0) {
    if (!this.mappings.byName[type][sound.fileName])
      this.mappings.byName[type][sound.fileName] = {};
    this.mappings.byName[type][sound.fileName][sound.path] = index;
  }

  buildSongList() {
    try {
      this.loopDirectoryRecursive(this.delugePaths.songs, (file, directory) => {
        this.files.songs.push(new Song(directory, file, this.mappings, this.rootDir));
      });
      console.log(this.files.songs.length, 'song(s) loaded from SD card');
    } catch {
      // we can load up fine without a songs directory
    }
  }

  async loadSongs() {
    if (this.files.songs.length > 0) {
      let loaded = 0;
      for (const song of this.files.songs) {
        await song
          .loadXML()
          .then(() => loaded++)
          .catch(err => console.error('Error loading xml for', song.fileName, err));
      }
      console.log('Loaded XML for', loaded, 'of', this.files.songs.length, 'songs');
    }
  }

  mapSongInstrumentsToSounds() {
    // console.log(this.mappings.byName.synths);
    for (const [songIndex, song] of this.files.songs.entries()) {
      for (const instrument of song.instruments) {
        //instrument.getSoundIndex(this.mappings);
        const {id, type} = instrument.getSoundIndex(this.mappings);
        if (id != 'new') {
          instrument.rewriteName = this.files[type][id].fileName;
          instrument.rewriteFolder = this.files[type][id].path;
          this.files[type][id].songIDs.add(songIndex);
          // console.log(this.files[type][id].songIDs);
        }
      }
    }
  }

  // async rewriteSongsToV4() {
  //   for (const song of this.files.songs) {
  //     if (song.validate()) song.rewriteInstrumentXMLAttributes();
  //     if (song.validate()) await song.saveXML();
  //   }
  // }

  // async rewriteInstrumentsToV4() {
  //   for (const synth of this.files.synths) {
  //     await synth.renameFileToV4();
  //   }
  //   for (const kit of this.files.kits) {
  //     await kit.renameFileToV4();
  //   }
  // }
}

export default fileSystem;
