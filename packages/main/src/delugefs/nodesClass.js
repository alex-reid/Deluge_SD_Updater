import {
  getTypeMapping,
  getOldTypeAndNumber,
  getOldNameFromSlot,
  getNameRegex,
  getNameAndSuffix,
} from './utils';

class Node {
  constructor(xmlData, xml) {
    this.xml = xml;
    this.xmlData = xmlData;
    this.presetType = null;
    this.presetName = null;
    this.presetFolder = null;
    this.presetSlot = null;
    this.presetSubSlot = null;
  }
  setupXml() {
    const $ = this.xml;
    const node = this.xmlData;
    return {$, node};
  }

  printNode() {
    const output = {};
    for (const key in this) {
      if (key != 'xml' && key != 'xmlData') output[key] = this[key];
    }
    console.log(output);
  }
}

class Instrument extends Node {
  constructor(xmlData, xml) {
    super(xmlData, xml);
    this.hasPresetName = false;
    this.hasPresetFolder = false;
    this.hasPresetSlot = false;
    this.hasPresetSubSlot = false;
    this.types = null;
    this.isV4 = false;
    this.renamed = false;
    this.formatType = null;
    this.patchName = '';
    this.patchSuffix = '';
    this.patchSuffixClean = '';
    this.getPresetData();
    this.clips = null;
    this.soundID = null;
  }
  getPresetData() {
    const {$, node} = this.setupXml();
    this.presetSlot = $(node).attr('presetSlot') || null;
    this.presetSubSlot = $(node).attr('presetSubSlot') || null;
    this.presetName = $(node).attr('presetName') || null;
    this.presetFolder = $(node).attr('presetFolder') || null;
    this.presetType = $(node)[0].name;
    this.rewriteName = '';
    this.rewriteFolder = '';
    this.getCommonPresetData();
  }
  getDataFromFilename() {
    return getOldTypeAndNumber(this.presetName);
  }

  getPresetType() {
    const parts = getNameRegex(this.presetName);
    if (this.hasPresetSlot && this.hasPresetSubSlot) {
      return 'old';
    }
    if (this.hasPresetName && this.hasPresetFolder) {
      if (this.presetName.match(/^\d{3}([a-z])?( \d)?$/i)) {
        return 'numsonly';
      }
      if (parts && (parts[3] || parts[4])) {
        return 'newsuffix';
      }
      return 'new';
    }
    if (!this.hasPresetFolder && this.hasPresetName) {
      return 'nameonly';
    }
    return 'unknown';
  }

  getCommonPresetData() {
    this.hasPresetName = !!this.presetName;
    this.hasPresetFolder = !!this.presetFolder;
    this.hasPresetSlot = !!this.presetSlot;
    this.hasPresetSubSlot = !!this.presetSubSlot;
    this.presetSlot = this.presetSlot && parseInt(this.presetSlot);
    this.presetSubSlot = this.presetSubSlot && parseInt(this.presetSubSlot);
    this.types = getTypeMapping(this.presetType, 'xml');
    this.isV4 = !!(!this.presetSlot && !this.presetSubSlot && this.presetFolder && this.presetName);
    this.formatType = this.getPresetType();
    this.patchNameAndSuffix();
  }

  patchNameAndSuffix() {
    let rename = this.presetName;
    if (this.formatType == 'old') {
      rename = getOldNameFromSlot(this.presetType, this.presetSlot, this.presetSubSlot);
    } else if (this.formatType == 'numsonly') {
      rename = this.types.file + this.presetName;
    }
    if (rename) {
      const [name, suffix, suffixClean] = getNameAndSuffix(rename);
      this.patchName = name;
      this.patchSuffix = suffix;
      this.patchSuffixClean = suffixClean;
    }
  }

  rewritePresetToV4(name, folder) {
    const {$, node} = this.setupXml();
    $(node).attr('presetName', name);
    $(node).attr('presetFolder', folder || this.types.folder);

    $(node).removeAttr('presetSlot');
    $(node).removeAttr('presetSubSlot');

    this.getPresetData();
    this.renamed = true;
  }

  getSoundIndex(mappings) {
    const name = this.patchName;
    const suffix = this.patchSuffix;
    const folder = this.presetFolder || this.types.folder;
    let id = mappings.byName[this.types.type][name + suffix]?.[folder];
    if (!Number.isInteger(id)) id = mappings.byName[this.types.type][name]?.[folder];
    this.soundID = Number.isInteger(id) ? id : 'new';
    // console.log(this.soundID, this.patchName, this.patchSuffix, this.presetName, id);
    return {id: this.soundID, type: this.types.type};
  }
}
class Clip extends Node {
  constructor(xmlData, xml) {
    super(xmlData, xml);
    this.getPresetData();
  }
  getPresetData() {
    const {$, node} = this.setupXml();
    this.presetName = $(node).attr('instrumentPresetName') || null;
    this.presetFolder = $(node).attr('instrumentPresetFolder') || null;
    this.presetSlot = $(node).attr('instrumentPresetSlot') || null;
    this.presetSubSlot = $(node).attr('instrumentPresetSubSlot') || null;
    this.presetType =
      $(node).find('kitParams, soundParams')?.[0]?.name.replace('Params', '') || 'notsound';
  }

  rewritePresetToV4(name, folder) {
    const {$, node} = this.setupXml();
    $(node).attr('instrumentPresetName', name);
    $(node).attr('instrumentPresetFolder', folder);

    $(node).removeAttr('instrumentPresetSlot');
    $(node).removeAttr('instrumentPresetSubSlot');

    this.getPresetData();
  }
}

export {Node, Instrument, Clip};
