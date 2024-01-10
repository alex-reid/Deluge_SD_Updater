import {letterToIndexMap, indexToLetterMap, typeMappings, SUFFIX} from './definitions';
import path from 'path';

const matchOldName = /^(SYNT|SONG|KIT|SAMP)(\d*)([a-zA-Z]?)( \d+)?(.+)?/i;

/**
 * Gets the raw regex components of a file name
 *
 * [1]:type,[2]:digits,[3]:slot letter,[4]:slot number,[5]:any additional data
 *
 * @param {string} fileName
 * @returns {['input','type','digits','letter','number','additional data']|null}
 */
function getNameRegex(fileName) {
  if (typeof fileName == 'string') return fileName.match(matchOldName);
  return false;
}

/**
 *
 * @param {string} fileName
 * @returns {{soundType: string|null, soundNumber: string|null, name: string, baseName: string, fileName: string, suffixLetter: string|null, suffixNumber: string|null, suffixWord: string|null, suffixType: string, suffix: string, suffixV4: string}}
 */
function getNameComponents(fileName) {
  const regex = getNameRegex(fileName);
  const defaults = {
    fileName,
    baseName: fileName,
    soundType: null,
    soundNumber: null,
    suffixLetter: null,
    suffixNumber: null,
    suffixWord: null,
    suffixType: SUFFIX.NONE,
    suffix: '',
    suffixV4: '',
  };

  if (regex) {
    const [, soundType, soundNumber, suffixLetter, suffixNumber, suffixWord] = regex;
    const updatedDefaults = {
      ...defaults,
      soundType,
      soundNumber,
      baseName: soundType + soundNumber,
    };
    if (suffixLetter) {
      return {
        ...updatedDefaults,
        suffixLetter,
        suffixType: SUFFIX.LETTER,
        suffix: suffixLetter,
        suffixV4: ' ' + (getNumberFromAlpha(suffixLetter) + 2),
      };
    }
    if (suffixNumber) {
      return {
        ...updatedDefaults,
        suffixNumber,
        suffixType: SUFFIX.NUMBER,
        suffix: suffixNumber,
        suffixV4: suffixNumber,
      };
    }
    if (suffixWord) {
      return {
        ...updatedDefaults,
        suffixWord,
        suffixType: SUFFIX.WORD,
        suffix: suffixWord,
        suffixV4: suffixWord,
      };
    }
    return updatedDefaults;
  }
  const numberRegex = fileName.match(/^(.+)(\s\d+)$/);
  if (numberRegex) {
    const [, base, num] = numberRegex;
    return {
      ...defaults,
      baseName: base,
      suffixNumber: num,
      suffix: num,
      suffixV4: num,
      suffixType: SUFFIX.NUMBER,
    };
  }
  return defaults;
}

/**
 * Parses old tags into a human readable string
 * @param {('sound'|'kit'|'song')} presetType
 * @param {number} presetSlot
 * @param {number} presetSubSlot
 * @returns {string} The name in the format of SYNT001A
 */
function getOldNameFromSlot(presetType, presetSlot, presetSubSlot) {
  return getFileFromXML(presetType) + formatNumber(presetSlot) + getAlphaFromIndex(presetSubSlot);
}

/**
 * Prettifies old deluge names like 'SYNT001' into '001 Synth'
 * @param {string} oldName
 * @returns {string} Pretty name
 */
function prettyName(oldName) {
  const {soundNumber, soundType, suffixV4} = getNameComponents(oldName);
  if (soundNumber && soundType) {
    return `${soundNumber} ${getMapping(soundType, 'file', 'pretty')}${suffixV4}`;
  }
  return false;
}

/**
 *
 * @param {string} a A letter between A-Z
 * @returns {number} a digit representation of A-Z as 0-25
 */
function getNumberFromAlpha(a) {
  return typeof a == 'string' ? letterToIndexMap[a.toLowerCase()] : -1;
}

/**
 *
 * @param {number} i
 * @returns {string} A letter representation of 0-25 as A-Z
 */
function getAlphaFromIndex(i) {
  return indexToLetterMap[i]?.toUpperCase() || '';
}

/**
 *
 * @param {number} number
 * @returns {string} Pads digits to three places ie. 12 becomes 012
 */
function formatNumber(number) {
  return number.toString().padStart(3, '0');
}
/**
 *
 * @param {string} type
 * @param {('type'|'folder'|'xml'|'file'|'pretty')} inputType
 * @returns
 */
function getTypeMapping(type, inputType = 'type') {
  return typeMappings.find(e => e[inputType] == type);
}

/**
 *
 * @param {string} name The string to match on
 * @param {('type'|'folder'|'xml'|'file'|'pretty')} input The input type
 * @param {('type'|'folder'|'xml'|'file'|'pretty')} output The output type
 * @returns {string} The matched type
 */
function getMapping(name, input, output) {
  return typeMappings.find(e => e[input] == name)[output] || false;
}

/**
 * Utility for fetching Type from XML
 * @param {string} type
 * @returns {string}
 */
function getXMLElementType(type) {
  return getMapping(type, 'xml', 'type');
}
/**
 * Utility for fetching File from XML
 * @param {string} type
 * @returns {string}
 */
function getFileFromXML(type) {
  return getMapping(type, 'xml', 'file');
}
/**
 * Utility for fetching File from Type
 * @param {string} type
 * @returns {string}
 */
function getFileFromType(type) {
  return getMapping(type, 'type', 'file');
}

/**
 * Utility for fetching Folder from File type
 * @param {string} type
 * @returns {string}
 */
function getFolderFromFileType(type) {
  return getMapping(type, 'file', 'folder');
}
/**
 * Utility for fetching Folder from Type
 * @param {string} type
 * @returns {string}
 */
function getFolderFromType(type) {
  return getMapping(type, 'type', 'folder');
}

/**
 * Windows was doing funny things when trying to do a simple string replace
 * to get a relative path for files. This splits the paths into arrays and
 * then genreates a posix compatible path from that.
 *
 * @param {string} rootPath - The path that you want to subtract from the full path
 * @param {string} filePath - The full path
 * @returns {string}
 */
function getPath(rootPath, filePath) {
  // remove blank entries from path arrays
  const reducer = (a, c) => (c ? [...a, c] : a);
  const splitFile = filePath.split(path.sep).reduce(reducer, []);
  const splitRoot = rootPath.split(path.sep).reduce(reducer, []);
  const relPath = splitFile.slice(splitRoot.length);
  return path.posix.join(...relPath);
}

function newlineXMLAttrs(xml) {
  // match all nodes
  const nodes = xml.match(/(\t*)(<[\s\S]*?>)/g);

  const out = nodes.map(xmlNode => {
    // get indents
    const tabs = xmlNode.match(/^\t*/g);
    // get attrs
    const attrs = xmlNode.match(/(\w+="[^"]*")/g);
    if (attrs && attrs.length > 2) {
      // replace all attrs with newline + tabs + an extra tab
      return xmlNode.replaceAll(/(\w+="[^"]*")/g, '\n' + tabs[0] + '\t$&');
    }
    return xmlNode;
  });
  return out.join('\n');
}

export {
  getNumberFromAlpha,
  getAlphaFromIndex,
  formatNumber,
  getXMLElementType,
  getFileFromType,
  getFolderFromFileType,
  getFolderFromType,
  getFileFromXML,
  getTypeMapping,
  prettyName,
  getOldNameFromSlot,
  getNameRegex,
  getNameComponents,
  getPath,
  newlineXMLAttrs,
};
