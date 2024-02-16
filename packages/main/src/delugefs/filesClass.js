import {load} from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import {
  getFolderFromFileType,
  getPath,
  getNameComponents,
  fixXMLEscapedAttributes,
} from '../../../common/utils';

import {Instrument, Clip} from './nodesClass';
import {newNames} from '../../../common/definitions';
import beautifyXML from './beautifyXML';

/**
 * Class representing an XML file on the deluge
 */
class File {
  constructor(filePath, fileName, rootPath) {
    this.path = getPath(rootPath, filePath); //filePath.replace(rootPath + path.sep, '');
    this.rootPath = rootPath;
    this.fullFileName = fileName;
    this.fileName = fileName.replace(/\.xml$/i, '');
    this.systemPath = filePath;
    this.XML = null;
    this.isLoaded = false;
  }

  async loadXML() {
    try {
      const xmlContent = await fs.readFile(path.join(this.systemPath, this.fullFileName), 'utf-8');
      this.XML = load(
        xmlContent,
        {
          xmlMode: true, // Set xmlMode to true for XML parsing
          onParseError: err => console.error('parse error', err),
        },
        false,
      );
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
    const modifiedXml = fixXMLEscapedAttributes(beautifyXML(this.XML.xml()));
    const newXmlFilePath = path.join(this.systemPath, this.fileName + '.XML');
    fs.writeFile(newXmlFilePath, modifiedXml, 'utf-8');
  }
}

/**
 * Class representing a song XML file on the deluge
 * @extends File
 */
class Song extends File {
  constructor(path, fileName, mappings, rootPath) {
    super(path, fileName, rootPath);
    this.mappings = mappings;
    this.elementsWithAttributes = null;
    this.elementsWithNames = null;
    /** @type {Instrument[]} */
    this.instruments = [];
    /** @type {Clip[]} */
    this.clips = [];
    this.firmwareVersion = null;
    this.songID = null;
  }

  onXMLLoaded() {
    this.getFirmwareVersion();
    this.getInstruments();
    this.getClips();
    this.addClipIdsToInstruments();
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
    }
    return this.instruments.length;
  }

  validate() {
    let valid = true;
    let instClips = 0;
    this.clips.forEach(clip => {
      if (clip.presetType != 'notsound') instClips++;
    });
    let clipsFound = 0;
    this.instruments.forEach(i => {
      if (i.clips.length < 1) {
        valid = false;
        throw new Error('found an orphaned sound in ' + this.fileName);
      }
      clipsFound += i.clips.length;
    });
    if (instClips != clipsFound) {
      valid = false;
      throw new Error('found an orphaned clip in ' + this.fileName);
    }
    return valid;
  }

  rewriteInstrumentsAndClipsXMLAttributes(newNames) {
    const output = [{type: 'song', data: `Processing song ${this.fileName}\n`}];
    // console.log('insts', this.instruments.length, newNames.length);
    if (this.instruments.length !== newNames.length) {
      throw new Error('new names are not the same length as instruments');
    }
    this.instruments.forEach((instrument, index) => {
      const {rewriteName, rewriteFolder} = newNames[index];
      if (!rewriteName || !rewriteFolder) {
        throw new Error('invalid data in new names array');
      }
      // console.log(rewriteFolder, rewriteName, index, instrument.clips);
      instrument.rewritePresetToV4(rewriteName, rewriteFolder);
      const clipIDs = [];
      instrument.clips.forEach(clip => {
        this.clips[clip].rewritePresetToV4(rewriteName, rewriteFolder);
        clipIDs.push(clip);
      });
      output.push({
        type: 'success',
        data: `Rewrote sound ${index} to ${rewriteName}. Updated clips ${clipIDs.join(',')}\n`,
      });
    });
    return output;
  }

  getClips() {
    if (this.isLoaded) {
      this.clips = [];
      this.XML('sessionClips instrumentClip').each((_i, clip) => {
        this.clips.push(new Clip(clip, this.XML));
      });
    }
    return this.clips.length;
  }

  getInstrumentClipIndexs(instrument) {
    return this.clips.reduce((acc, clip, index) => {
      if (
        instrument.presetType == clip.presetType &&
        instrument.presetSlot == clip.presetSlot &&
        instrument.presetSubSlot == clip.presetSubSlot &&
        instrument.presetName == clip.presetName
      ) {
        return [...acc, index];
      }
      return acc;
    }, []);
  }

  addClipIdsToInstruments() {
    for (const instrument of this.instruments) {
      instrument.clips = this.getInstrumentClipIndexs(instrument);
    }
  }
}

/**
 * Class representing an Instrument XML file on the deluge
 * @extends File
 */
class Sound extends File {
  constructor(path, fileName, rootPath) {
    super(path, fileName, rootPath);
    /** @type {number|null} */
    this.soundID = null;
    this.presetName = fileName.replace(/\.xml$/i, '');
    this.sound = getNameComponents(this.presetName);
    this.newName = this.getNewName();
    this.songIDs = new Set();
    /** @type {('KIT'|'SYNT')} */
    this.presetType = '';
  }

  getNewName() {
    const {baseName, suffixV4, soundType, soundNumber} = this.sound;
    if (soundType && soundNumber) {
      const getName = newNames[getFolderFromFileType(soundType)][parseInt(soundNumber)];
      if (getName) {
        return getName + suffixV4;
      }
      return baseName + suffixV4;
    }
    return '';
  }

  renameFileToV4() {
    const newName = this.getNewName();
    if (this.isOldName) {
      fs.rename(
        path.join(this.systemPath, this.fullFileName),
        path.join(this.systemPath, newName + '.XML'),
      )
        .then(() => console.log('Renamed', this.fileName + '.XML', 'to', newName + '.XML'))
        .catch(err => console.error(err));
    }
  }

  async renameFile(newName) {
    const out = await fs
      .rename(
        path.join(this.systemPath, this.fullFileName),
        path.join(this.systemPath, newName + '.XML'),
      )
      .then(() => ({
        type: 'success',
        data: 'Renamed ' + this.fileName + '.XML ' + 'to ' + newName + '.XML',
      }))
      .catch(err => ({
        type: 'fail',
        data: 'Error naming ' + this.fileName + '.XML ' + 'to ' + newName + '.XML\n' + err,
      }));
    return out;
  }
}
/**
 * Class representing an Kit XML file on the deluge
 * @extends Sound
 */
class Kit extends Sound {
  constructor(path, fileName, rootPath) {
    super(path, fileName, rootPath);
    this.presetType = 'KIT';
  }
}
/**
 * Class representing an Synth XML file on the deluge
 * @extends Sound
 */
class Synth extends Sound {
  constructor(path, fileName, rootPath) {
    super(path, fileName, rootPath);
    this.presetType = 'SYNT';
  }
}

export {File, Song, Sound, Kit, Synth};
