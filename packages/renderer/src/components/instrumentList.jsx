import {Chip, ListItem, ListItemIcon, ListItemText, Typography} from '@mui/material';
import React, {memo, useEffect, useState} from 'react';
import PianoIcon from '@mui/icons-material/Piano';
import AppsIcon from '@mui/icons-material/Apps';
import {Box} from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import {InstNameTextField} from './InstNameTextField';
import Path from './Path';

const InstrumentList = ({
  oldName,
  path,
  presetType,
  index,
  updateHandler,
  rewriteName,
  songIDs,
  duplicate,
}) => {
  const [name, setName] = useState(rewriteName);
  const [error, setError] = useState(false);
  const [allowSave, setAllowSave] = useState(true);

  useEffect(() => {
    if (!name) setName(rewriteName);
  }, [rewriteName]);

  useEffect(() => {
    if (name && name.length > 0) {
      //eslint-disable-next-line
      let rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
      let rg2 = /^\./; // cannot start with dot (.)
      let rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
      if (!rg1.test(name)) {
        setError('Filename can\'t contain characters  / : * ? " < > |');
        setAllowSave(false);
      } else if (rg2.test(name)) {
        setError('Filename cannot start with a dot');
        setAllowSave(false);
      } else if (rg3.test(name)) {
        setError('Filename is forbidden');
        setAllowSave(false);
      } else if (duplicate) {
        setError('Duplicate file name. Please rename.');
        setAllowSave(true);
      } else {
        setError(false);
      }
    } else if (duplicate) {
      setError('Duplicate file name. Please rename.');
      setAllowSave(true);
    } else {
      setError(false);
      setAllowSave(true);
    }
  }, [name, duplicate]);
  return (
    <ListItem sx={{borderBottom: 1, borderColor: 'divider'}}>
      <ListItemIcon>
        {presetType == 'SYNT' && <PianoIcon color="primary" />}
        {presetType == 'KIT' && <AppsIcon color="primary" />}
      </ListItemIcon>
      <ListItemText
        primary={
          <Box
            sx={{
              fontWeight: 700,
              fontSize: '1.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <InstNameTextField
              error={!!error}
              helperText={error}
              label={oldName}
              size="small"
              variant="standard"
              onChange={e => setName(e.target.value)}
              value={name}
              onBlur={e => {
                if (allowSave) updateHandler(index, e.target.value);
              }}
              onKeyDown={e => {
                if (e.code === 'Enter') {
                  e.target.blur();
                }
              }}
              InputProps={{
                endAdornment: <EditIcon sx={{pointerEvents: 'none'}} />,
              }}
            />
            <Box sx={{display: 'flex', alignItems: 'center', fontSize: '1rem'}}>
              <Typography>Songs:&ensp;</Typography>
              <Chip
                size="small"
                label={songIDs.length}
                color="secondary"
              />
              &emsp;
              <Path path={path} />
            </Box>
          </Box>
        }
      />
    </ListItem>
  );
};

export default memo(
  InstrumentList,
  (prev, next) => !(prev.rewriteName != next.rewriteName || prev.duplicate != next.duplicate),
);
