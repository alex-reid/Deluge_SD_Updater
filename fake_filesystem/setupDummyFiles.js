import {getOldNameFromSlot} from '../packages/main/src/delugefs/utils';
import fs from 'fs';
import path from 'path';
import beautify from 'xml-beautifier';
const {load} = require('cheerio');

/*
FAKE DELUGE SD FILES BELOW
*/
const testFiles = [
  {
    fileName: 'V3_OLD.XML',
    firmware: '3.0.0',
    data: [
      {
        type: 'kit',
        attrs: {presetSlot: 0, presetSubSlot: -1},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetSlot: 0, presetSubSlot: -1},
        hasFile: true,
      },
      {
        type: 'kit',
        attrs: {presetSlot: 171, presetSubSlot: 1},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetSlot: 171, presetSubSlot: 1},
        hasFile: true,
      },
      {
        type: 'kit',
        attrs: {presetSlot: 271, presetSubSlot: -1},
        hasFile: false,
      },
      {
        type: 'sound',
        attrs: {presetSlot: 271, presetSubSlot: -1},
        hasFile: false,
      },
    ],
  },
  {
    fileName: 'V4_OLDNAMES.XML',
    firmware: '3.0.0',
    data: [
      {
        type: 'kit',
        attrs: {presetName: 'KIT001', presetFolder: 'KITS'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: 'SYNT001', presetFolder: 'SYNTHS'},
        hasFile: true,
      },
      {
        type: 'kit',
        attrs: {presetName: 'KIT172', presetFolder: 'KITS'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: 'SYNT172', presetFolder: 'SYNTHS'},
        hasFile: true,
      },
      {
        type: 'kit',
        attrs: {presetName: 'KIT173', presetFolder: 'KITS'},
        hasFile: false,
      },
      {
        type: 'sound',
        attrs: {presetName: 'SYNT173', presetFolder: 'SYNTHS'},
        hasFile: false,
      },
      {
        type: 'kit',
        attrs: {presetName: 'KIT272B', presetFolder: 'KITS'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: 'SYNT272B', presetFolder: 'SYNTHS'},
        hasFile: true,
      },
    ],
  },
];

export const fakeFS = () => {
  const songXmlBase = `<?xml version="1.0" encoding="UTF-8"?>
<song>
<instruments/>
<sessionClips/>
</song>`;

  const dummyInstrument = '<?xml version="1.0" encoding="UTF-8"?><sound/>';

  const mappings = {
    kit: {
      instruments: '<kit/>',
      sessionClips: '<kitParams/>',
      dir: 'KITS',
    },
    sound: {
      instruments: '<sound/>',
      sessionClips: '<soundParams/>',
      dir: 'SYNTHS',
    },
  };

  if (fs.existsSync(path.join(__dirname, 'FAKE_SD_CARD'))) {
    fs.rmSync(path.join(__dirname, 'FAKE_SD_CARD'), {recursive: true});
  }
  fs.mkdirSync(path.join(__dirname, 'FAKE_SD_CARD/SYNTHS'), {recursive: true});
  fs.mkdirSync(path.join(__dirname, 'FAKE_SD_CARD/SONGS'), {recursive: true});
  fs.mkdirSync(path.join(__dirname, 'FAKE_SD_CARD/KITS'), {recursive: true});
  fs.mkdirSync(path.join(__dirname, 'FAKE_SD_CARD/SAMPLES'), {recursive: true});

  testFiles.forEach(({fileName, firmware, data}) => {
    const $ = load(songXmlBase, {
      xmlMode: true, // Set xmlMode to true for XML parsing
      pretty: true, // Enable pretty printing
    });
    $('song').attr(('firmwareVersion', firmware));
    data.forEach(({type, attrs, hasFile}) => {
      const newInstElem = $(mappings[type].instruments);
      $('instruments').append(newInstElem);
      const newClipElem = $('<instrumentClip/>');
      $('sessionClips').append(newClipElem);
      for (const name in attrs) {
        newInstElem.attr(name, attrs[name]);
        newClipElem.attr(name.replace('p', 'instrumentP'), attrs[name]);
      }
      newClipElem.append(mappings[type].sessionClips);
      if (hasFile) {
        let name = attrs.presetName;
        if (typeof attrs.presetSlot === 'number' && typeof attrs.presetSubSlot === 'number') {
          name = getOldNameFromSlot(type, attrs.presetSlot, attrs.presetSubSlot);
          console.log(name);
        }
        if (name) {
          fs.writeFileSync(
            path.join(__dirname, 'FAKE_SD_CARD', mappings[type].dir, name + '.XML'),
            dummyInstrument,
          );
        } else {
          console.log(
            'problem with ',
            {type, attrs, hasFile},
            getOldNameFromSlot(type, attrs.presetSlot, attrs.presetSubSlot),
          );
        }
      }
    });
    fs.writeFileSync(path.join(__dirname, 'FAKE_SD_CARD', 'SONGS', fileName), beautify($.xml()));
  });
  return path.join(__dirname, 'FAKE_SD_CARD');
};
