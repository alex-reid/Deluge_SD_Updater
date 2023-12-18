import cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import {getOldTypeAndNumber, getFileFromType, getFolderFromFileType, formatNumber} from './utils';

import {Instrument, Clip} from './nodesClass';
import {newNames} from './definitions';

class File {
  constructor(path, fileName, rootPath) {
    this.path = path.replace(rootPath, '');
    this.rootPath = rootPath;
    this.fullFileName = fileName;
    this.fileName = fileName.replace(/\.xml$/i, '');
    this.XML = null;
    this.isLoaded = false;
    this.isOldName = false;
  }

  async loadXML() {
    try {
      const xmlContent = await fs.readFile(
        path.join(this.rootPath, this.path, this.fullFileName),
        'utf-8',
      );
      this.XML = cheerio.load(
        xmlContent,
        {
          xmlMode: true, // Set xmlMode to true for XML parsing
          pretty: true, // Enable pretty printing
          onParseError: err => console.error('parse error', err),
        },
        false,
      );
      //console.log("loaded", this.fileName);
      this.isLoaded = true;
      this.onXMLLoaded();
    } catch (error) {
      console.error(
        'Error loading or parsing XML file:',
        path.join(this.rootPath, this.path, this.fileName),
        '\n',
        error,
      );
    }
  }

  onXMLLoaded() {}

  async saveXML() {
    // Save the modified XML to a new file
    const modifiedXml = this.XML.xml();
    const newXmlFilePath = path.join(this.rootPath, this.path, this.fileName + '_v4.XML');
    fs.writeFile(newXmlFilePath, modifiedXml, 'utf-8');
  }
}

class Song extends File {
  constructor(path, fileName, mappings, rootPath) {
    super(path, fileName, rootPath);
    this.mappings = mappings;
    this.elementsWithAttributes = null;
    this.elementsWithNames = null;
    this.instruments = [];
    this.clips = [];
    this.firmwareVersion = null;
  }

  onXMLLoaded() {
    this.getFirmwareVersion();
    this.getInstruments();
    this.getClips();
  }

  getFirmwareVersion() {
    if (this.isLoaded) {
      this.firmwareVersion = this.XML('[firmwareVersion]').attr('firmwareVersion')?.split('.') || [
        0, 0, 0,
      ];
    }
  }

  getInstruments() {
    if (this.isLoaded) {
      this.instruments = [];
      this.XML('instruments > sound, instruments > kit').each((_i, instrument) => {
        this.instruments.push(new Instrument(instrument, this.XML));
      });

      // console.log(
      //   "----",
      //   this.fileName,
      //   this.firmwareVersion.join("."),
      //   "----"
      // );
      // this.instruments.forEach((instrument, i) => {
      //   instrument.printNode();
      // });
      // console.log(
      //   "----",
      //   this.fileName,
      //   this.firmwareVersion.join("."),
      //   "----"
      // );
    }
    return this.instruments.length;
  }

  validate() {
    let valid = true;
    this.addClipIdsToInstruments();
    let clipsFound = 0;
    this.instruments.forEach(i => {
      if (i.clips.length < 1) {
        valid = false;
        console.log('\x1b[31mfound an orphaned sound in\x1b[0m', this.fileName);
      }
      clipsFound += i.clips.length;
    });
    if (this.clips.length != clipsFound) {
      valid = false;
      console.log('\x1b[31mfound an orphaned clip in\x1b[0m', this.fileName);
    }
    return valid;
  }

  rewriteInstrumentXMLAttributes() {
    this.addClipIdsToInstruments();
    this.instruments.forEach(instrument => {
      // if (this.firmwareVersion[0] < 4)
      // console.log({
      //   presetType: instrument.presetType,
      //   presetName: instrument.presetName,
      //   presetFolder: instrument.presetFolder,
      //   presetSlot: instrument.presetSlot,
      //   presetSubSlot: instrument.presetSubSlot,
      //   type: instrument.getPresetType(),
      //   version: this.firmwareVersion,
      // });
      console.log('before', this.fileName, {
        n: instrument.presetName,
        f: instrument.presetFolder,
      });
      switch (instrument.getPresetType()) {
        case 'old':
          this.rewriteOld(instrument);
          break;
        case 'numsonly':
          this.rewriteNumsOnly(instrument);
          break;
        case 'new':
          this.rewriteNew(instrument);
          break;
        case 'nameonly':
          this.rewriteNameOnly(instrument);
          break;
        case 'unknown':
          break;
        default:
      }

      if (!instrument.isV4) {
        console.log('-conversion failed-');
        instrument.printNode();
      }
      if (instrument.renamed) {
        console.log('renamed', {
          n: instrument.presetName,
          f: instrument.presetFolder,
        });
      } else {
        console.log('the same', {
          n: instrument.presetName,
          f: instrument.presetFolder,
        });
      }
    });
  }

  rewriteOld(instrument) {
    const nameOld = this.getNewNameBySlot(
      instrument.types.type,
      instrument.presetSlot,
      instrument.presetSubSlot,
    );
    instrument.rewritePresetToV4(nameOld);
    instrument.rewriteFolder(instrument.presetFolder || false);
    instrument.clips.forEach(clip => {
      clip.rewritePresetToV4(nameOld);
      clip.rewriteFolder(instrument.presetFolder || false);
    });
  }

  rewriteNumsOnly(instrument) {
    const pseudoName = instrument.types.file + instrument.presetName;
    const numsOnlyName = this.mappings.byName[instrument.types.type][pseudoName];
    if (numsOnlyName) {
      instrument.rewritePresetToV4(numsOnlyName);
      instrument.clips.forEach(clip => {
        clip.rewritePresetToV4(numsOnlyName);
      });
    }
  }

  rewriteNew(instrument) {
    const data = instrument.getDataFromFilename();
    if (data) {
      let name = this.getNewNameBySlot(instrument.types.type, data.presetSlot, data.presetSubSlot);
      if (data.v4versionNum) name += data.v4versionNum;
      instrument.rewritePresetToV4(name);
      instrument.rewriteFolder();
      instrument.clips.forEach(clip => {
        clip.rewritePresetToV4(name);
        clip.rewriteFolder();
      });
    }
  }

  rewriteNameOnly(instrument) {
    instrument.rewriteFolder();
    instrument.clips.forEach(clip => {
      clip.rewriteFolder();
    });
  }

  getClips() {
    if (this.isLoaded) {
      this.clips = [];
      this.XML('sessionClips instrumentClip').each((_i, clip) => {
        const attrs = this.XML(clip).find('kitParams, soundParams');
        if (attrs.length > 0) this.clips.push(new Clip(clip, this.XML));
      });
      // console.log(
      //   "----",
      //   this.fileName,
      //   this.firmwareVersion.join("."),
      //   "----"
      // );
      // this.clips.forEach((clip, i) => {
      //   console.log("clip", i);
      //   clip.printNode();
      // });
      // console.log(
      //   "----",
      //   this.fileName,
      //   this.firmwareVersion.join("."),
      //   "----"
      // );
    }
    return this.clips.length;
  }

  getClipInstruments(clip) {
    return this.instruments.filter(
      instrument =>
        clip.presetType == instrument.presetType &&
        clip.presetSlot == instrument.presetSlot &&
        clip.presetSubSlot == instrument.presetSubSlot &&
        clip.presetName == instrument.presetName,
    );
  }

  getInstrumentClips(instrument) {
    return this.clips.filter(
      clip =>
        instrument.presetType == clip.presetType &&
        instrument.presetSlot == clip.presetSlot &&
        instrument.presetSubSlot == clip.presetSubSlot &&
        instrument.presetName == clip.presetName,
    );
  }

  addClipIdsToInstruments() {
    for (const instrument of this.instruments) {
      instrument.clips = this.getInstrumentClips(instrument);
    }
  }

  getNewNameBySlot(type, slot, subSlot) {
    const map = this.mappings.byID[type]?.[slot]?.[subSlot + 1];
    if (map) {
      return map;
    } else {
      return getFileFromType(type) + formatNumber(slot);
    }
  }
}

class Sound extends File {
  constructor(path, fileName, rootPath) {
    super(path, fileName, rootPath);
    this.presetName = fileName.replace(/\.xml$/i, '');
    this.presetType = null;
    this.presetSlot = null;
    this.presetSubSlot = null;
    this.loadMetaData();
    this.newName = this.getNewName();
  }

  loadMetaData() {
    const fileData = getOldTypeAndNumber(this.fileName);
    if (fileData) {
      const {isOldName, presetType, presetSlot, presetSubSlot, v4versionNum} = fileData;
      this.isOldName = isOldName;
      this.presetType = presetType;
      this.presetSlot = presetSlot;
      this.presetSubSlot = presetSubSlot;
      this.v4Version = v4versionNum;
    }
  }

  getNewName() {
    let name;
    if (this.isOldName) {
      name = newNames[getFolderFromFileType(this.presetType)][this.presetSlot];
      if (this.presetSubSlot > -1) name += ' ' + (this.presetSubSlot + 2);
      if (this.v4versionNum) name += this.v4versionNum;
    }
    return name || '';
  }

  renameFileToV4() {
    const newName = this.getNewName();
    if (this.isOldName) {
      fs.rename(
        path.join(this.rootPath, this.path, this.fileName + '.XML'),
        path.join(this.rootPath, this.path, newName + '.XML'),
      )
        .then(() => console.log('Renamed', this.fileName + '.XML', 'to', newName + '.XML'))
        .catch(err => console.error(err));
    }
  }
}

class Kit extends Sound {
  constructor(path, fileName, rootPath) {
    super(path, fileName, rootPath);
    this.presetType = 'KIT';
  }
}

class Synth extends Sound {
  constructor(path, fileName, rootPath) {
    super(path, fileName, rootPath);
    this.presetType = 'SYNT';
  }
}

export {File, Song, Sound, Kit, Synth};
