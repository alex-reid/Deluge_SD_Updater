import {letterToIndexMap, indexToLetterMap, typeMappings} from './definitions';

const matchOldName = /^(SYNT|SONG|KIT|SAMP)(\d*)([a-zA-Z]?)( \d+)?/;

function getOldTypeAndNumber(fileName) {
  const fileData = fileName.match(matchOldName);
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

function prettyName(oldName) {
  const fileData = oldName.match(matchOldName);
  if (fileData) {
    const [, type, slot, subSlot, version] = fileData;
    return `${slot} ${getMapping(type, 'file', 'pretty')}${subSlot && ' ' + subSlot}${
      version && version
    }`;
  }
  return false;
}

function getNumberFromAlpha(a) {
  return a ? letterToIndexMap[a.toLowerCase()] : -1;
}

function getAlphaFromIndex(i) {
  return indexToLetterMap[i].toUpperCase() || '';
}

function formatNumber(number) {
  return number.toString().padStart(3, '0');
}

function getTypeMapping(type, inputType = 'type') {
  return typeMappings.find(e => e[inputType] == type);
}

function getMapping(name, input, output) {
  return typeMappings.find(e => e[input] == name)[output] || false;
}

function getXMLElementType(type) {
  return getMapping(type, 'xml', 'type');
}

function getFileFromXML(type) {
  return getMapping(type, 'xml', 'file');
}

function getFileFromType(type) {
  return getMapping(type, 'type', 'file');
}

function getFolderFromFileType(type) {
  return getMapping(type, 'file', 'folder');
}
function getFolderFromType(type) {
  return getMapping(type, 'type', 'folder');
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
};