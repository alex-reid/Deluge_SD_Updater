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
    this.debug = false;
    this.files = {
      /** @type {Kit[]} */
      kits: [],
      /** @type {Synth[]} */
      synths: [],
      /** @type {Song[]} */
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
    this.debug = !!options.debug;

    if (this.debug) console.log('-------DEBUG ON-------');

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

  /**
   *
   * @param {Synth|Kit} a
   * @param {Synth|Kit} b
   * @returns {number}
   */
  soundSortFunc(a, b) {
    const names = a.presetName.localeCompare(b.presetName, 'en', {
      numeric: true,
      ignorePunctuation: true,
    });
    const folders = a.path.localeCompare(b.path, 'en', {numeric: true, ignorePunctuation: true});
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
    if (this.debug) {
      this.files.synths.forEach(synth => {
        console.log(
          synth.path,
          '\n',
          synth.rootPath,
          '\n',
          synth.fullFileName,
          '\n',
          synth.fileName,
          '\n',
          synth.systemPath,
          '\n',
        );
      });

      console.log(this.mappings.byName.synths);
    }
  }

  /**
   *
   * @param {Kit|Synth} sound
   * @param {('kits'|'synths')} type
   * @param {number} index
   */
  addNewMappings(sound, type, index = 0) {
    if (!this.mappings.byName[type][sound.fileName])
      this.mappings.byName[type][sound.fileName] = {};
    this.mappings.byName[type][sound.fileName][sound.path] = index;
  }

  /**
   *
   * @param {Synth|Kit} a
   * @param {Synth|Kit} b
   * @returns {number}
   */
  songSortFunc(a, b) {
    const names = a.fileName.localeCompare(b.fileName, 'en', {
      numeric: true,
      ignorePunctuation: true,
    });
    const folders = a.path.localeCompare(b.path, 'en', {numeric: true, ignorePunctuation: true});
    return folders == 0 ? names : folders;
  }

  buildSongList() {
    try {
      this.loopDirectoryRecursive(this.delugePaths.songs, (file, directory) => {
        this.files.songs.push(new Song(directory, file, this.mappings, this.rootDir));
      });
      // Sort Songs alphanumerically by folder -> name
      this.files.songs.sort(this.songSortFunc);
      console.log(this.files.songs.length, 'song(s) loaded from SD card');
    } catch {
      // we can load up fine without a songs directory
    }
  }

  async loadSongs() {
    if (this.files.songs.length > 0) {
      let loaded = 0;
      for (const [songID, song] of this.files.songs.entries()) {
        song.songID = songID;
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
        const {id, type} = instrument.getSoundIndex(this.mappings, this.debug);
        if (id != 'new') {
          instrument.rewriteName = this.files[type][id].fileName;
          instrument.rewriteFolder = this.files[type][id].path;
          this.files[type][id].songIDs.add(songIndex);
          // console.log(this.files[type][id].songIDs);
        } else {
          instrument.rewriteName = instrument.patchName + instrument.patchSuffix;
          instrument.rewriteFolder = instrument.presetFolder || instrument.types.folder;
        }
      }
    }
  }

  async rewriteInsts(type, files) {
    const updated = [];
    for (const file of files) {
      if (file.willUpdate && this.files[type][file.id]) {
        await this.files[type][file.id].renameFile(file.rewriteName).then(data => {
          updated.push(data);
        });
      }
    }
    return updated;
  }

  async rewriteSongs(files) {
    const updated = [];

    for (const song of files) {
      if (this.files.songs[song.id]) {
        if (this.files.songs[song.id].validate()) {
          const done = this.files.songs[song.id].rewriteInstrumentsAndClipsXMLAttributes(
            song.instruments,
          );
          if (this.files.songs[song.id].validate()) {
            await this.files.songs[song.id].saveXML();
            updated.push(done);
          }
        }
      }
    }
    return updated;
  }

  handleRewrite(files) {
    const {synthNames, kitNames, songInsts} = files;
    this.rewriteInsts('synths', synthNames)
      .then(done => {
        this.browserWindow.webContents.send('export-update-results', done);
        console.log(done);
        return this.rewriteInsts('kits', kitNames);
      })
      .then(done => {
        this.browserWindow.webContents.send('export-update-results', done);
        console.log(done);
        return this.rewriteSongs(songInsts);
      })
      .then(done => {
        this.browserWindow.webContents.send('export-update-results', done);
      })
      .catch(err => console.error(err));
  }
}

export default fileSystem;
