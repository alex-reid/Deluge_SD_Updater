import {letterToIndexMap, indexToLetterMap, typeMappings} from './definitions';

const matchOldNameStrict = /^(SYNT|SONG|KIT|SAMP)(\d*)([a-zA-Z]?)( \d+)?$/i;
const matchOldName = /^(SYNT|SONG|KIT|SAMP)(\d*)([a-zA-Z]?)( \d+)?(.+)?/i;

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

function getNameRegex(fileName) {
  if (typeof fileName == 'string') return fileName.match(matchOldName);
  return false;
}

function getOldNameFromSlot(presetType, presetSlot, presetSubSlot) {
  return getFileFromXML(presetType) + formatNumber(presetSlot) + getAlphaFromIndex(presetSubSlot);
}

function prettyName(oldName) {
  const [name, , suffix] = getNameAndSuffix(oldName);
  const fileData = name.match(matchOldName);
  if (fileData) {
    const [, type, slot] = fileData;
    return `${slot} ${getMapping(type, 'file', 'pretty')}${suffix}`;
  }
  return false;
}

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
      patchSuffixClean = `${typeof num === 'number' ? ' ' + (num + 2) : ''}${
        name[4] ? name[4] : ''
      }`;
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

function getNumberFromAlpha(a) {
  return typeof a == 'string' ? letterToIndexMap[a.toLowerCase()] : -1;
}

function getAlphaFromIndex(i) {
  return indexToLetterMap[i]?.toUpperCase() || '';
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
  getOldNameFromSlot,
  getNameRegex,
  getNameAndSuffix,
};
