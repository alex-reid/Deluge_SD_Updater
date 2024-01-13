/* MODIFIED FROM

  name: xml-beautifier,
  version: 0.5.0,
  title: XML Beautifier,
  description: Beautifies XML documents by putting each tag and text node on their own line and correctly indents everything,

  url: https://github.com/svenheden/xml-beautifier.git
  author: Jonathan Svenheden <jonathan@svenheden.com>,
  license: MIT,
*/

const repeat = require('repeat-string');

const splitOnTags = function splitOnTags(str) {
  return str.split(/(<\/?[^>]+>)/g).filter(function (line) {
    return line.trim() !== '';
  });
};
const isTag = function isTag(str) {
  return /<[^>!]+>/.test(str);
};
const isXMLDeclaration = function isXMLDeclaration(str) {
  return /<\?[^?>]+\?>/.test(str);
};
const isClosingTag = function isClosingTag(str) {
  return /<\/+[^>]+>/.test(str);
};
const isSelfClosingTag = function isSelfClosingTag(str) {
  return /<[^>]+\/>/.test(str);
};
const isOpeningTag = function isOpeningTag(str) {
  return isTag(str) && !isClosingTag(str) && !isSelfClosingTag(str) && !isXMLDeclaration(str);
};

function getAttrs(input) {
  const regex = /<(\w+)([^>]*?)(\/?)>/;
  const match = input.match(regex);

  if (match) {
    const openingTag = `<${match[1]}`;
    const attributesString = match[2].trim();
    const hasClosingSlash = !!match[3];
    const closingTag = hasClosingSlash ? '/>' : '>';

    // Extracting individual attributes as an array of strings
    const attributeRegex = /(\w+="[^"]*")/g;
    const attributes = attributesString.match(attributeRegex) || [];
    if (attributes.length > 2) {
      return {openingTag, attributes, closingTag};
    }
  }
  return null;
}

const tagsToSkip = ['modeNote', 'selectedDrumIndex'];

function skipTags(item, endpos = false) {
  const tagName = item.match(/<(\/?)(\w+)/);
  if (tagName?.[2]) {
    if (tagName[1] == '/' && !endpos) return false;
    if (tagName[1] == '' && endpos) return false;
    return tagsToSkip.includes(tagName[2]);
  }
  return false;
}

export default function beautifyXML(xml, indent = '    ') {
  let depth = 0;
  let ignoreMode = false;
  let deferred = [];

  return splitOnTags(xml)
    .map(function (item) {
      if (skipTags(item)) {
        item = repeat(indent, depth) + item;
        ignoreMode = true;
      }
      if (skipTags(item, true)) {
        ignoreMode = false;
        deferred.push(item);
        const cdataBlock = deferred.join('');
        deferred = [];
        return cdataBlock;
      }
      if (ignoreMode) {
        deferred.push(item);
        return null;
      }

      const attrs = getAttrs(item);
      let line;

      // removes any pre-existing whitespace chars at the end or beginning of the item
      item = item.replace(/^\s+|\s+$/g, '');

      if (isClosingTag(item)) {
        depth--;
      }

      if (attrs) {
        line = repeat(indent, depth) + attrs.openingTag + '\n' + repeat(indent, depth + 1);
        line += attrs.attributes.join('\n' + repeat(indent, depth + 1));
        line += attrs.closingTag;
      } else {
        line = repeat(indent, depth) + item;
      }

      if (isOpeningTag(item)) {
        depth++;
      }

      return line;
    })
    .filter(function (c) {
      return c;
    })
    .join('\n');
}
