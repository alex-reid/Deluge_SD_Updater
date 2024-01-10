import {FORMATS} from './definitions';
import {getTypeMapping, getOldNameFromSlot, getNameRegex, getNameAndSuffix} from './utils';

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
    this.has = {
      /** @return {boolean} */
      presetSlot: () => !isNaN(this.presetSlot) && Number.isInteger(this.presetSlot),
      /** @return {boolean} */
      presetSubSlot: () => !isNaN(this.presetSubSlot) && Number.isInteger(this.presetSubSlot),
      /** @return {boolean} */
      presetName: () => !!this.presetName,
      /** @return {boolean} */
      presetFolder: () => !!this.presetFolder,
    };
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
    const presetSlot = $(node).attr('presetSlot');
    const presetSubSlot = $(node).attr('presetSubSlot');

    this.presetSlot = presetSlot ? parseInt(presetSlot) : null;
    this.presetSubSlot = presetSubSlot ? parseInt(presetSubSlot) : null;
    this.presetName = $(node).attr('presetName') || null;
    this.presetFolder = $(node).attr('presetFolder') || null;

    this.types = getTypeMapping($(node)[0].name, 'xml');
    this.presetType = this.types.xml;

    this.formatType = this.getFormatType();
    this.patchNameAndSuffix();
  }

  /**
   *
   * @returns The type of the deluge preset in this node
   */
  getFormatType() {
    const parts = getNameRegex(this.presetName);
    if (this.has.presetSlot() && this.has.presetSubSlot()) {
      return FORMATS.OLD;
    }
    if (this.has.presetName() && this.has.presetFolder()) {
      if (this.presetName.match(/^\d{3}([a-z])?( \d)?$/i)) {
        return FORMATS.NUMBERS_ONLY;
      }
      if (parts && (parts[3] || parts[4])) {
        return FORMATS.NEW_SUFFIX;
      }
      return FORMATS.NEW;
    }
    if (!this.has.presetFolder() && this.has.presetName()) {
      return FORMATS.JUST_NAME;
    }
    return FORMATS.UNKNOWN;
  }

  patchNameAndSuffix() {
    let rename = this.presetName;
    if (this.formatType == FORMATS.OLD) {
      rename = getOldNameFromSlot(this.presetType, this.presetSlot, this.presetSubSlot);
    } else if (this.formatType == FORMATS.NUMBERS_ONLY) {
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
    let hasSuffixFile = false;
    let id = 'new';
    const idOnPresetName = mappings.byName[this.types.type][this.presetName]?.[folder];
    const idOnSuffix = mappings.byName[this.types.type][name + suffix]?.[folder];
    const idOnPatchname = mappings.byName[this.types.type][name]?.[folder];
    if (debug) console.log({idOnPresetName, idOnSuffix, idOnPatchname});
    if (Number.isInteger(idOnPresetName)) {
      id = idOnPresetName;
    } else if (Number.isInteger(idOnSuffix)) {
      id = idOnSuffix;
      hasSuffixFile = true;
    } else if (Number.isInteger(idOnPatchname)) {
      id = idOnPatchname;
    }
    this.soundID = id;
    if (debug)
      console.log({
        soundID: this.soundID,
        name,
        suffix,
        folder,
        presetName: this.presetName,
        id,
        map: mappings.byName,
        type: this.presetType,
        clean: this.patchSuffixClean,
        teston: mappings.byName[this.types.type][this.presetName]?.[folder],
      });
    return {id: this.soundID, type: this.types.type, hasSuffix: hasSuffixFile};
  }
}

class Clip extends Node {
  constructor(xmlData, xml) {
    super(xmlData, xml);
    this.getPresetData();
  }
  getPresetData() {
    const {$, node} = this.setupXml();
    const presetSlot = $(node).attr('instrumentPresetSlot');
    const presetSubSlot = $(node).attr('instrumentPresetSubSlot');

    this.presetSlot = presetSlot ? parseInt(presetSlot) : null;
    this.presetSubSlot = presetSubSlot ? parseInt(presetSubSlot) : null;

    this.presetName = $(node).attr('instrumentPresetName') || null;
    this.presetFolder = $(node).attr('instrumentPresetFolder') || null;
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
