import fs from 'fs';
import path from 'path';
import beautify from 'xml-beautifier';
import {getOldNameFromSlot} from '../packages/main/src/delugefs/utils';
const {load} = require('cheerio');

/*
FAKE DELUGE SD FILES BELOW
*/
const testFiles = [
  {
    fileName: 'old.XML',
    firmware: '4.0.0',
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
    fileName: 'numsonly.XML',
    firmware: '4.0.0',
    data: [
      {
        type: 'kit',
        attrs: {presetName: '001', presetFolder: 'KITS'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: '001', presetFolder: 'SYNTHS'},
        hasFile: true,
      },
      {
        type: 'kit',
        attrs: {presetName: '172', presetFolder: 'KITS'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: '172', presetFolder: 'SYNTHS'},
        hasFile: true,
      },
      {
        type: 'kit',
        attrs: {presetName: '173', presetFolder: 'KITS'},
        hasFile: false,
      },
      {
        type: 'sound',
        attrs: {presetName: '173', presetFolder: 'SYNTHS'},
        hasFile: false,
      },
      {
        type: 'kit',
        attrs: {presetName: '272B', presetFolder: 'KITS'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: '272B', presetFolder: 'SYNTHS'},
        hasFile: true,
      },
    ],
  },
  {
    fileName: 'newsuffix.XML',
    firmware: '4.0.0',
    data: [
      {
        type: 'kit',
        attrs: {presetName: 'KIT001 2', presetFolder: 'KITS'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: 'SYNT001 2', presetFolder: 'SYNTHS'},
        hasFile: true,
      },
      {
        type: 'kit',
        attrs: {presetName: 'KIT181 10', presetFolder: 'KITS'},
        hasFile: false,
      },
      {
        type: 'sound',
        attrs: {presetName: 'SYNT181 10', presetFolder: 'SYNTHS'},
        hasFile: false,
      },
      {
        type: 'kit',
        attrs: {presetName: 'KIT187A', presetFolder: 'KITS'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: 'SYNT187A', presetFolder: 'SYNTHS'},
        hasFile: true,
      },
      {
        type: 'kit',
        attrs: {presetName: 'KIT197B', presetFolder: 'KITS'},
        hasFile: false,
      },
      {
        type: 'sound',
        attrs: {presetName: 'SYNT197B', presetFolder: 'SYNTHS'},
        hasFile: false,
      },
    ],
  },
  {
    fileName: 'new.XML',
    firmware: '4.0.0',
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
  {
    fileName: 'new_directories.XML',
    firmware: '4.0.0',
    data: [
      {
        type: 'kit',
        attrs: {presetName: 'KIT000', presetFolder: 'KITS/sub folder'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: 'SYNT000', presetFolder: 'SYNTHS/sub folder'},
        hasFile: true,
      },
      {
        type: 'kit',
        attrs: {presetName: 'KIT182', presetFolder: 'KITS/sub folder'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: 'SYNT182', presetFolder: 'SYNTHS/sub folder'},
        hasFile: true,
      },
      {
        type: 'kit',
        attrs: {presetName: 'KIT183', presetFolder: 'KITS/sub folder'},
        hasFile: false,
      },
      {
        type: 'sound',
        attrs: {presetName: 'SYNT183', presetFolder: 'SYNTHS/sub folder'},
        hasFile: false,
      },
      {
        type: 'kit',
        attrs: {presetName: 'KIT282B', presetFolder: 'KITS/sub folder'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: 'SYNT282B', presetFolder: 'SYNTHS/sub folder'},
        hasFile: true,
      },
    ],
  },
  {
    fileName: 'nameonly.XML',
    firmware: '4.0.0',
    data: [
      {
        type: 'kit',
        attrs: {presetName: 'KIT008'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: 'SYNT008'},
        hasFile: true,
      },
      {
        type: 'kit',
        attrs: {presetName: 'KIT188B'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: 'SYNT188B'},
        hasFile: true,
      },
    ],
  },
  {
    fileName: 'nameonly_newnames.XML',
    firmware: '4.0.0',
    data: [
      {
        type: 'kit',
        attrs: {presetName: 'new kit'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: 'new synth'},
        hasFile: true,
      },
      {
        type: 'kit',
        attrs: {presetName: 'new kit 2'},
        hasFile: true,
      },
      {
        type: 'sound',
        attrs: {presetName: 'new synth 2'},
        hasFile: true,
      },
    ],
  },
];

function createFileWithDirectoriesSync(filePath, content) {
  // Ensure the parent directories exist
  const directoryPath = path.dirname(filePath);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, {recursive: true});
  }

  // Create the file with the specified content
  fs.writeFileSync(filePath, content);

  // console.log(`File "${filePath}" created successfully.`);
}

export const fakeFS = (structure = testFiles, dir = 'FAKE_SD_CARD') => {
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
      prefix: 'KIT',
    },
    sound: {
      instruments: '<sound/>',
      sessionClips: '<soundParams/>',
      dir: 'SYNTHS',
      prefix: 'SYNT',
    },
  };

  if (fs.existsSync(path.join(__dirname, dir))) {
    fs.rmSync(path.join(__dirname, dir), {recursive: true});
  }
  fs.mkdirSync(path.join(__dirname, dir, '/SYNTHS'), {recursive: true});
  fs.mkdirSync(path.join(__dirname, dir, '/SONGS'), {recursive: true});
  fs.mkdirSync(path.join(__dirname, dir, '/KITS'), {recursive: true});
  fs.mkdirSync(path.join(__dirname, dir, '/SAMPLES'), {recursive: true});

  structure.forEach(({fileName, firmware, data}) => {
    const $ = load(songXmlBase, {
      xmlMode: true, // Set xmlMode to true for XML parsing
      pretty: true, // Enable pretty printing
    });
    $('song').attr('firmwareVersion', firmware);
    data.forEach(({type, attrs, hasFile}) => {
      const newInstElem = $(mappings[type].instruments);
      $('instruments').append(newInstElem);
      const newClipElem = $('<instrumentClip/>');
      for (const name in attrs) {
        newInstElem.attr(name, attrs[name]);
        newClipElem.attr(name.replace('p', 'instrumentP'), attrs[name]);
      }
      newClipElem.append(mappings[type].sessionClips);
      $('sessionClips').append(newClipElem, newClipElem);
      if (hasFile) {
        let name = attrs.presetName;
        if (typeof attrs.presetSlot === 'number' && typeof attrs.presetSubSlot === 'number') {
          name = getOldNameFromSlot(type, attrs.presetSlot, attrs.presetSubSlot);
        }
        if (name) {
          if (name.match(/^\d{3}\w?$/)) name = mappings[type].prefix + name;
          const folder = attrs.presetFolder || mappings[type].dir;
          createFileWithDirectoriesSync(
            path.join(__dirname, dir, folder, name + '.XML'),
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
    fs.writeFileSync(path.join(__dirname, dir, 'SONGS', fileName), beautify($.xml()));
  });
  return path.join(__dirname, dir);
};
