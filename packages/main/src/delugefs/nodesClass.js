import {getTypeMapping, getOldTypeAndNumber, getOldNameFromSlot} from './utils';

class Node {
  constructor(xmlData, xml) {
    this.xml = xml;
    this.xmlData = xmlData;
    this.presetType = null;
    this.presetName = null;
    this.presetFolder = null;
    this.presetSlot = null;
    this.presetSubSlot = null;
    this.hasPresetName = false;
    this.hasPresetFolder = false;
    this.hasPresetSlot = false;
    this.hasPresetSubSlot = false;
    this.types = null;
    this.isV4 = false;
    this.renamed = false;
    this.formatType = null;
    this.patchName = '';
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

  getDataFromFilename() {
    return getOldTypeAndNumber(this.presetName);
  }

  getPresetType() {
    if (this.hasPresetSlot && this.hasPresetSubSlot) {
      return 'old';
    }
    if (this.hasPresetName && this.hasPresetFolder) {
      if (this.presetName.match(/^\d{3}\w?$/)) {
        return 'numsonly';
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
    if (this.formatType == 'old') {
      this.patchName = getOldNameFromSlot(this.presetType, this.presetSlot, this.presetSubSlot);
    } else if (this.formatType == 'numsonly') {
      this.patchName = this.types.file + this.presetName;
    }
  }
}

class Instrument extends Node {
  constructor(xmlData, xml) {
    super(xmlData, xml);
    this.getPresetData();
    this.clips = null;
  }
  getPresetData() {
    const {$, node} = this.setupXml();
    this.presetSlot = $(node).attr('presetSlot') || null;
    this.presetSubSlot = $(node).attr('presetSubSlot') || null;
    this.presetName = $(node).attr('presetName') || null;
    this.presetFolder = $(node).attr('presetFolder') || null;
    this.presetType = $(node)[0].name;
    this.getCommonPresetData();
  }

  rewritePresetToV4(name) {
    const {$, node} = this.setupXml();
    $(node).attr('presetName', name);

    $(node).removeAttr('presetSlot');
    $(node).removeAttr('presetSubSlot');

    this.getPresetData();
    this.renamed = true;
  }

  rewriteFolder(folder) {
    const {$, node} = this.setupXml();
    $(node).attr('presetFolder', folder || this.types.folder);
    this.getPresetData();
    this.renamed = true;
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
    this.presetType = $(node).find('kitParams, soundParams')?.[0]?.name.replace('Params', '');
    this.getCommonPresetData();
  }

  rewritePresetToV4(name, folder) {
    const {$, node} = this.setupXml();
    $(node).attr('instrumentPresetName', name);
    $(node).attr('instrumentPresetFolder', folder);

    $(node).removeAttr('instrumentPresetSlot');
    $(node).removeAttr('instrumentPresetSubSlot');

    this.getPresetData();
  }

  rewriteFolder(folder) {
    const {$, node} = this.setupXml();
    $(node).attr('instrumentPresetFolder', folder || this.types.folder);
    this.getPresetData();
  }
}

export {Node, Instrument, Clip};
