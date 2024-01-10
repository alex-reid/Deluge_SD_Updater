import {letterToIndexMap, indexToLetterMap, typeMappings, SUFFIX} from './definitions';
import path from 'path';

const matchOldNameStrict = /^(SYNT|SONG|KIT|SAMP)(\d*)([a-zA-Z]?)( \d+)?$/i;
const matchOldName = /^(SYNT|SONG|KIT|SAMP)(\d*)([a-zA-Z]?)( \d+)?(.+)?/i;

/**
 * Parses a string to see if it fits the naming schema for deluge files
 * @param {string} fileName
 * @returns {{isOldName:boolean,presetType:string,presetSlot:number|undefined,presetSubSlot:number|undefined,v4versionNum:string|undefined}}
 */
function getOldTypeAndNumber(fileName) {
  const fileData = fileName.match(matchOldNameStrict);
  if (fileData) {
    return {
      isOldName: true,
      presetType: fileData[1],
      presetSlot: parseInt(fileData[2]),
      presetSubSlot: getNumberFromAlpha(fileData[3]),
      v4versionNum: fileData[4],
    };
  }
  return false;
}

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

function getNameComponents(fileName) {
  const regex = getNameRegex(fileName);
  let suffixType = SUFFIX.NONE;
  if (regex) {
    const [, soundType, soundNumber, suffixLetter, suffixNumber, suffixWord] = regex;
    if (suffixLetter) suffixType = SUFFIX.LETTER;
    if (suffixNumber) suffixType = SUFFIX.NUMBER;
    if (suffixWord) suffixType = SUFFIX.WORD;
    return {
      fileName,
      baseName: soundType + soundNumber,
      soundType,
      soundNumber,
      suffixLetter,
      suffixNumber,
      suffixWord,
      suffixType,
    };
  }
  const numberRegex = fileName.match(/^(.+)(\s\d+)$/);
  if (numberRegex) {
    return {
      fileName,
      baseName: numberRegex[1],
      suffixNumber: numberRegex[2],
      suffixType: SUFFIX.NUMBER,
    };
  }
  return {
    fileName,
    suffixType,
  };
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
  const [name, , suffix] = getNameAndSuffix(oldName);
  const fileData = name.match(matchOldName);
  if (fileData) {
    const [, type, slot] = fileData;
    return `${slot} ${getMapping(type, 'file', 'pretty')}${suffix}`;
  }
  return false;
}

/**
 * Returns a name and suffix for old style names
 * @param {string} oldName
 * @returns {[name:string, suffix:string, V4Suffix:string]}
 */
function getNameAndSuffix(oldName) {
  const {fileName, baseName, suffixLetter, suffixNumber, suffixWord, suffixType} =
    getNameComponents(oldName);

  let suffixV4;
  switch (suffixType) {
    case SUFFIX.LETTER:
      suffixV4 = ' ' + (getNumberFromAlpha(suffixLetter) + 2);
      return [baseName, suffixLetter, suffixV4];
    case SUFFIX.NUMBER:
      return [baseName, suffixNumber, suffixNumber];
    case SUFFIX.WORD:
      return [baseName, suffixWord, suffixWord];
    default:
      return [fileName, '', ''];
  }
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
  getOldTypeAndNumber,
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
  getNameAndSuffix,
  getNameComponents,
  getPath,
  newlineXMLAttrs,
};
