import {describe, expect, it} from 'vitest';
import fileSystem from '../src/delugefs/fileSystemClass';
import path from 'path';

import {fakeFS} from '../../../fake_filesystem/setupDummyFiles';

let Deluge, dummy_dir;

expect.addSnapshotSerializer({
  print(val) {
    // Replace the project directory with a placeholder to make it system-independent
    const projectDirectory = path.resolve(__dirname, '..', '..', '..');
    const normalizedPath = val.replace(
      new RegExp(projectDirectory.replace(/\\/g, '\\\\'), 'g'),
      '<PROJECT_DIRECTORY>',
    );

    // Replace backslashes with forward slashes for consistency
    return normalizedPath.replace(/\\/g, '/');
  },
  test(val) {
    return typeof val === 'string';
  },
});

const setup = async files => {
  Deluge = new fileSystem();
  dummy_dir = fakeFS(
    [
      {
        fileName: 'test.XML',
        firmware: '4.0.0',
        data: files,
      },
    ],
    'test_dir',
  );
  await Deluge.init(dummy_dir, {
    renameToV4: true,
    prettyNames: false,
  });
  return Deluge;
};

describe.sequential('mappings that should map to the base instrument', async () => {
  const Deluge = await setup([
    // initital actual instruments
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000', presetFolder: 'SYNTHS'},
      hasFile: true,
    },
    // test on 'new' type
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    // test on 'no folder' type
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000'},
      hasFile: false,
    },
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000A'},
      hasFile: false,
    },
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000 2'},
      hasFile: false,
    },
    // test on 'new suffix' type
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000A', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000 2', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    // test on 'digits only' type
    {
      type: 'sound',
      attrs: {presetName: '000', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    {
      type: 'sound',
      attrs: {presetName: '000A', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    {
      type: 'sound',
      attrs: {presetName: '000 2', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    // test on 'old' type

    {
      type: 'sound',
      attrs: {presetSlot: 0, presetSubSlot: -1},
      hasFile: false,
    },

    {
      type: 'sound',
      attrs: {presetSlot: 0, presetSubSlot: 0},
      hasFile: false,
    },
  ]);

  it('checks synth mappings', () => {
    expect(Deluge.files.synths[0].songIDs.has(0)).toBe(true);
  });
  it('checks song mappings', () => {
    // console.log(Deluge.files.songs[0].instruments);
    Deluge.files.songs[0].instruments.forEach(ins => {
      if (ins.soundID != 0) {
        console.log(ins);
      }
      expect(ins.soundID).toBe(0);
    });
  });
});

describe.sequential('mappings that should map to a letter suffixed instrument', async () => {
  const Deluge = await setup([
    // initital actual instruments
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000', presetFolder: 'SYNTHS'},
      hasFile: true,
    },
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000A', presetFolder: 'SYNTHS'},
      hasFile: true,
    },
    // test on 'new' type
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000A', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    // test on 'no folder' type
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000A'},
      hasFile: false,
    },
    // test on 'new suffix' type
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000A', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    // test on 'digits only' type
    {
      type: 'sound',
      attrs: {presetName: '000A', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    // test on 'old' type
    {
      type: 'sound',
      attrs: {presetSlot: 0, presetSubSlot: 0},
      hasFile: false,
    },
  ]);

  it('checks synth mappings', () => {
    expect(Deluge.files.synths[0].songIDs.has(0)).toBe(true);
  });
  it('checks song mappings', () => {
    Deluge.files.songs[0].instruments.forEach(ins => {
      if (ins.presetName != 'SYNT000' && ins.presetFolder != 'SYNTHS') {
        expect(ins.soundID).toBe(1);
      }
    });
  });
});

describe.sequential("mappings that shouldn't map to a suffixed instrument", async () => {
  const Deluge = await setup([
    // initital actual instruments
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000A', presetFolder: 'SYNTHS'},
      hasFile: true,
    },
    // test on 'new' type
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000 2', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    // test on 'no folder' type
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000 2'},
      hasFile: false,
    },
    // test on 'new suffix' type
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000 2', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    // test on 'digits only' type
    {
      type: 'sound',
      attrs: {presetName: '000 2', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
  ]);

  it('checks synth mappings', () => {
    expect(Deluge.files.synths[0].songIDs.has(0)).toBe(true);
  });
  it('checks song mappings', () => {
    Deluge.files.songs[0].instruments.forEach(ins => {
      if (ins.soundID != 'new') {
        ins.printNode();
      }
      if (ins.presetName != 'SYNT000' && ins.presetFolder != 'SYNTHS') {
        expect(ins.soundID).toBe('new');
      }
    });
  });
});

describe.sequential('mappings that should map to a number suffixed instrument', async () => {
  const Deluge = await setup([
    // initital actual instruments
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000 2', presetFolder: 'SYNTHS'},
      hasFile: true,
    },
    // test on 'new' type
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000 2', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    // test on 'no folder' type
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000 2'},
      hasFile: false,
    },
    // test on 'new suffix' type
    {
      type: 'sound',
      attrs: {presetName: 'SYNT000 2', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    // test on 'digits only' type
    {
      type: 'sound',
      attrs: {presetName: '000 2', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
  ]);

  it('checks synth mappings', () => {
    expect(Deluge.files.synths[0].songIDs.has(0)).toBe(true);
  });
  it('checks song mappings', () => {
    Deluge.files.songs[0].instruments.forEach(ins => {
      if (ins.soundID != 0) {
        ins.printNode();
      }
      if (ins.presetName != 'SYNT000' && ins.presetFolder != 'SYNTHS') {
        expect(ins.soundID).toBe(0);
      }
    });
  });
});

describe.sequential('mappings that should match by name', async () => {
  const Deluge = await setup([
    // initital actual instruments
    {
      type: 'sound',
      attrs: {presetName: 'new synth', presetFolder: 'SYNTHS'},
      hasFile: true,
    },
    // test on 'new' type
    {
      type: 'sound',
      attrs: {presetName: 'new synth 2', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    // test on 'no folder' type
    {
      type: 'sound',
      attrs: {presetName: 'new synth 2'},
      hasFile: false,
    },
  ]);

  it('checks synth mappings', () => {
    expect(Deluge.files.synths[0].songIDs.has(0)).toBe(true);
  });
  it('checks song mappings', () => {
    Deluge.files.songs[0].instruments.forEach(ins => {
      if (ins.soundID != 0) {
        ins.printNode();
      }
      if (ins.presetName != 'SYNT000' && ins.presetFolder != 'SYNTHS') {
        expect(ins.soundID).toBe(0);
      }
    });
  });
});

describe.sequential('mappings that should match by name an suffix', async () => {
  const Deluge = await setup([
    // initital actual instruments
    {
      type: 'sound',
      attrs: {presetName: 'new synth', presetFolder: 'SYNTHS'},
      hasFile: true,
    },
    {
      type: 'sound',
      attrs: {presetName: 'new synth 2', presetFolder: 'SYNTHS'},
      hasFile: true,
    },
    // test on 'new' type
    {
      type: 'sound',
      attrs: {presetName: 'new synth 2', presetFolder: 'SYNTHS'},
      hasFile: false,
    },
    // test on 'no folder' type
    {
      type: 'sound',
      attrs: {presetName: 'new synth 2'},
      hasFile: false,
    },
  ]);

  it('checks synth mappings', () => {
    expect(Deluge.files.synths[0].songIDs.has(0)).toBe(true);
  });
  it('checks song mappings', () => {
    Deluge.files.songs[0].instruments.forEach(ins => {
      if (ins.soundID != 1) {
        ins.printNode();
      }
      if (ins.presetName != 'SYNT000' && ins.presetFolder != 'SYNTHS') {
        expect(ins.soundID).toBe(1);
      }
    });
  });
});

describe.sequential('mappings that should match by name and suffix with a folder', async () => {
  const Deluge = await setup([
    // initital actual instruments
    {
      type: 'sound',
      attrs: {presetName: 'new synth 2', presetFolder: 'SYNTHS'},
      hasFile: true,
    },
    {
      type: 'sound',
      attrs: {presetName: 'new synth 2', presetFolder: path.join('SYNTHS', 'subfolder')},
      hasFile: true,
    },
    // test on 'new' type
    {
      type: 'sound',
      attrs: {presetName: 'new synth 2', presetFolder: path.join('SYNTHS', 'subfolder')},
      hasFile: false,
    },
  ]);

  it('checks synth mappings', () => {
    expect(Deluge.files.synths[0].songIDs.has(0)).toBe(true);
  });
  it('checks song mappings', () => {
    Deluge.files.songs[0].instruments.forEach(ins => {
      if (ins.soundID != 1) {
        ins.printNode();
      }
      if (ins.presetName != 'SYNT000' && ins.presetFolder != 'SYNTHS') {
        expect(ins.soundID).toBe(1);
      }
    });
  });
});

describe.sequential('mappings that should match by name and suffix with a folder', async () => {
  const Deluge = await setup([
    // initital actual instruments
    {
      type: 'sound',
      attrs: {presetName: 'new synth 2', presetFolder: 'SYNTHS'},
      hasFile: true,
    },
    {
      type: 'sound',
      attrs: {presetName: 'new synth', presetFolder: path.join('SYNTHS', 'subfolder')},
      hasFile: true,
    },
    // test on 'new' type
    {
      type: 'sound',
      attrs: {presetName: 'new synth 2', presetFolder: path.join('SYNTHS', 'subfolder')},
      hasFile: false,
    },
  ]);

  it('checks synth mappings', () => {
    expect(Deluge.files.synths[0].songIDs.has(0)).toBe(true);
  });
  it('checks song mappings', () => {
    Deluge.files.songs[0].instruments.forEach(ins => {
      if (ins.soundID != 1) {
        ins.printNode();
      }
      if (ins.presetName != 'SYNT000' && ins.presetFolder != 'SYNTHS') {
        expect(ins.soundID).toBe(1);
      }
    });
  });
});
