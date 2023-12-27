import {Box, Divider, Tooltip, Typography} from '@mui/material';
import React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import PianoIcon from '@mui/icons-material/Piano';
import AppsIcon from '@mui/icons-material/Apps';

export const InstrumentListSongList = ({instrument, index}) => {
  const [desc, ...types] = showType(instrument);
  let icon;
  if (instrument.isNewSound) {
    icon = <FiberNewIcon color="primary" />;
  } else if (instrument.type == 'sound') {
    icon = <PianoIcon color="primary" />;
  } else {
    icon = <AppsIcon color="primary" />;
  }
  return (
    <>
      <Box sx={{py: 1, display: 'flex', justifyContent: 'space-between'}}>
        <Typography
          display="flex"
          alignItems="center"
        >
          <strong style={{display: 'inline-block', width: '2rem'}}>{index + 1}.</strong>
          {icon}
          &emsp;{instrument.patchName + instrument.patchSuffixOld}
          {instrument.rewriteName && (
            <>
              &ensp;&rarr;&ensp;<strong>{instrument.rewriteName}</strong>
            </>
          )}
        </Typography>
        <Tooltip
          placement="left"
          title={
            <>
              <Typography
                variant="caption"
                sx={{mb: 1}}
              >
                Used in clips: {instrument.usedInClips.map(v => v + 1).join(', ')}
              </Typography>
              <Divider />
              <Typography
                variant="caption"
                sx={{mb: 1}}
              >
                {desc}
              </Typography>
              <Divider />
              <strong>Old Data:</strong>
              {types.map(({name, val}, i) => (
                <span key={i}>
                  <br />
                  {name}: {val}
                </span>
              ))}
            </>
          }
        >
          <InfoIcon />
        </Tooltip>
      </Box>
      <Divider sx={{borderWidth: '1px'}} />
      {/* <Typography
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
        <strong>Name:</strong> {instrument.rewriteName}
        <br />
        <strong>Path:</strong> {instrument.rewriteFolder}
      </pre>*/}
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
    case 'newsuffix':
      return [
        'This one has a suffix added. Still all set for v4+',
        {name: 'Preset Name', val: instrument.presetName},
        {name: 'Preset Folder', val: instrument.presetFolder},
      ];
    case 'nameonly':
      return [
        'Needs to have a folder added to it for this to be v4+',
        {name: 'Preset Name', val: instrument.presetName},
      ];
    case 'unknown':
      return [
        <Typography
          key={0}
          color="primary"
        >
          Logged as an unknown type
        </Typography>,
        {name: 'Preset Slot', val: instrument.presetSlot},
        {name: 'Preset Sub Slot', val: instrument.presetSubSlot},
        {name: 'Preset Name', val: instrument.presetName},
        {name: 'Preset Folder', val: instrument.presetFolder},
      ];
    default:
      return [
        <Typography
          key={0}
          color="primary"
        >
          Through to the keeper on this one
        </Typography>,
        {name: 'Preset Slot', val: instrument.presetSlot},
        {name: 'Preset Sub Slot', val: instrument.presetSubSlot},
        {name: 'Preset Name', val: instrument.presetName},
        {name: 'Preset Folder', val: instrument.presetFolder},
      ];
  }
};
