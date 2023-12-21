import {Typography} from '@mui/material';
import React from 'react';

export const InstrumentListSongList = ({instrument, index}) => {
  const [desc, ...types] = showType(instrument);
  const {rewriteName: newName, rewriteFolder: newPath} = instrument;
  return (
    <>
      <Typography
        variant="h5"
        color="secondary"
      >
        {index + 1}. {instrument.patchName || instrument.presetName}{' '}
        <small>Used in clip row: {instrument.usedInClips.map(v => v + 1).join(', ')}</small>
      </Typography>
      <pre>
        {desc}
        {types.map(({name, val}, i) => (
          <span key={i}>
            <br />
            {name}: {val}
          </span>
        ))}
        <br />
        &darr; <br />
        <strong>Name:</strong> {newName}
        <br />
        <strong>Path:</strong> {newPath}
      </pre>
    </>
  );
};

const showType = instrument => {
  switch (instrument.formatType) {
    case 'old':
      return [
        'Old ( < v4 ) style preset slot and subslot. Needs to be updated for v4+',
        {name: 'Preset Slot', val: instrument.presetSlot},
        {name: 'Preset Sub Slot', val: instrument.presetSubSlot},
      ];
    case 'numsonly':
      return [
        'Numbers only display from v4 onwards. Will be updated to look a bit nicer.',
        {name: 'Preset Name', val: instrument.presetName},
        {name: 'Preset Folder', val: instrument.presetFolder},
      ];
    case 'new':
      return [
        'The good stuff. All set for v4+',
        {name: 'Preset Name', val: instrument.presetName},
        {name: 'Preset Folder', val: instrument.presetFolder},
      ];
    case 'nameonly':
      return [
        'Needs to have a folder added to it for this to be v4+',
        {name: 'Preset Name', val: instrument.presetName},
      ];
    case 'unknown':
      return ['Something odd about this one', {name: '!!!!', val: '!!!!'}];
    default:
      return ['hmmmmm...', {name: '!!!!', val: '!!!!'}];
  }
};
