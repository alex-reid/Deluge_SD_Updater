import {letterToIndexMap, indexToLetterMap, typeMappings} from './definitions';
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
 * @param {string} fileName
 * @returns {string[]|null}
 */
function getNameRegex(fileName) {
  if (typeof fileName == 'string') return fileName.match(matchOldName);
  return false;
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
 * @returns {[patchName:string, patchSuffix:string, patchSuffixClean:string]}
 */
function getNameAndSuffix(oldName) {
  // console.log(oldName);
  let patchName = oldName;
  let patchSuffixClean = '';
  let patchSuffix = '';
  const name = getNameRegex(oldName);
  const v4suffix = oldName.match(/(.+)(\s\d+)$/);
  if (name) {
    patchName = name[1] + name[2];
    if (name[3] || name[4]) {
      const num = getNumberFromAlpha(name[3]);
      patchSuffixClean = `${Number.isInteger(num) ? ' ' + (num + 2) : ''}${name[4] ? name[4] : ''}`;
      patchSuffix = `${name[3] ? name[3] : ''}${name[4] ? name[4] : ''}`;
    }
  } else if (v4suffix) {
    patchName = v4suffix[1];
    patchSuffix = v4suffix[2];
    patchSuffixClean = v4suffix[2];
  }
  // console.log({patchName, patchSuffix, patchSuffixClean});
  return [patchName, patchSuffix, patchSuffixClean];
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
 *
 * @param {string} rootPath
 * @param {string} filePath
 */
function getPath(rootPath, filePath) {
  const reducer = (a, c) => (c ? [...a, c] : a);
  const splitFile = filePath.split(path.sep).reduce(reducer, []);
  const splitRoot = rootPath.split(path.sep).reduce(reducer, []);
  const relPath = splitFile.slice(splitRoot.length);
  return path.posix.join(...relPath);
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
  getPath,
};
