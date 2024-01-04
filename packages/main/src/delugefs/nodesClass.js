import {
  getTypeMapping,
  getOldTypeAndNumber,
  getOldNameFromSlot,
  getNameRegex,
  getNameAndSuffix,
} from './utils';

/** @typedef {import('cheerio').CheerioAPI} CheerioAPI */
/** @enum {("old" | "numsonly" | "newsuffix" | "new" | "nameonly" | "unknown")} FormatType */

/** Class represents a single XML node in the deluge */
class Node {
  /**
   *
   * @param {Element} xmlData
   * @param {CheerioAPI} xml
   */
  constructor(xmlData, xml) {
    /** The cheerio object from the parent XML file */
    this.xml = xml;
    /** The node that was parsed from the parent file */
    this.xmlData = xmlData;
    /** @type {('SYNT'|'KIT')|null} the type of the preset */
    this.presetType = null;
    /** @type {string|null} - the preset name */
    this.presetName = null;
    /** @type {string|null} - the preset folder */
    this.presetFolder = null;
    /** @type {number|null} - the preset slot */
    this.presetSlot = null;
    /** @type {number|null} - the preset sub slot */
    this.presetSubSlot = null;
  }
  /**
   * Sets up a nicer interface for Cheerio
   * @returns {{$:CheerioAPI,node:Element}}
   */
  setupXml() {
    const $ = this.xml;
    const node = this.xmlData;
    return {$, node};
  }
  /**
   * Prints out the node info minus the cheerio XML tags
   */
  printNode() {
    const output = {};
    for (const key in this) {
      if (key != 'xml' && key != 'xmlData') output[key] = this[key];
    }
    console.log(output);
  }
}

/**
 * Class representing an Instrument XML node
 * @extends Node
 */
class Instrument extends Node {
  constructor(xmlData, xml) {
    super(xmlData, xml);
    /** @type {boolean} */
    this.hasPresetName = false;
    /** @type {boolean} */
    this.hasPresetFolder = false;
    /** @type {boolean} */
    this.hasPresetSlot = false;
    /** @type {boolean} */
    this.hasPresetSubSlot = false;
    this.types = null;
    this.renamed = false;
    this.formatType = null;
    this.patchName = '';
    this.patchSuffix = '';
    this.patchSuffixClean = '';
    this.clips = null;
    this.soundID = null;
    this.rewriteName = '';
    this.rewriteFolder = '';
    this.getPresetData();
  }

  /**
   * Fetches instrument specific preset data from the provided XML
   */
  getPresetData() {
    const {$, node} = this.setupXml();
    this.presetSlot = $(node).attr('presetSlot') || null;
    this.presetSubSlot = $(node).attr('presetSubSlot') || null;
    this.presetName = $(node).attr('presetName') || null;
    this.presetFolder = $(node).attr('presetFolder') || null;
    this.presetType = $(node)[0].name;
    this.hasPresetName = !!this.presetName;
    this.hasPresetFolder = !!this.presetFolder;
    this.hasPresetSlot = !!this.presetSlot;
    this.hasPresetSubSlot = !!this.presetSubSlot;
    this.presetSlot = this.presetSlot && parseInt(this.presetSlot);
    this.presetSubSlot = this.presetSubSlot && parseInt(this.presetSubSlot);
    this.types = getTypeMapping(this.presetType, 'xml');
    this.formatType = this.getPresetType();
    this.patchNameAndSuffix();
  }
  /**
   *
   * @returns Old style type, slot and subslot info from the preset name
   */
  getDataFromFilename() {
    return getOldTypeAndNumber(this.presetName);
  }
  /**
   *
   * @returns The type of the deluge preset in this node
   */
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

  getSoundIndex(mappings, debug) {
    const name = this.patchName;
    const suffix = this.patchSuffix;
    const folder = this.presetFolder || this.types.folder;
    let id = mappings.byName[this.types.type][name + suffix]?.[folder];
    if (debug) console.log(id);
    if (!Number.isInteger(id)) id = mappings.byName[this.types.type][name]?.[folder];
    if (debug) console.log(id);
    this.soundID = Number.isInteger(id) ? id : 'new';
    if (debug) console.log(this.soundID, name, suffix, folder, this.presetName, id);
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
