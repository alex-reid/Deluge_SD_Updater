import {ListItem, ListItemIcon, ListItemText, TextField, Typography, styled} from '@mui/material';
import React, {memo, useEffect, useState} from 'react';
import PianoIcon from '@mui/icons-material/Piano';
import AppsIcon from '@mui/icons-material/Apps';
import {Box} from '@mui/system';
import theme from '../theme';
import EditIcon from '@mui/icons-material/Edit';
import SdCardIcon from '@mui/icons-material/SdCard';

const CssTextField = styled(TextField)({
  // '& .MuiInput-underline:after': {
  //   borderBottomColor: '#B2BAC2',
  // },
  margin: 0,
  padding: 0,
  minWidth: '28rem',
  width: '50%',
  marginBottom: '16px',
  '&.Mui-error': {
    color: theme.palette.primary.main,
  },
  '& .MuiFormHelperText-root': {
    position: 'absolute',
    top: '3.1rem',
    fontSize: '1rem',
    lineHeight: '1rem',
    color: theme.palette.primary.main,
  },
  '& .MuiTextField-root': {
    marginLeft: 0,
  },
  '& .MuiFormLabel-root': {
    fontWeight: 700,
    fontSize: '1.4rem',
  },
  '& .MuiFormLabel-root.Mui-focused, .MuiFormLabel-filled': {
    fontWeight: 700,
    fontSize: '1.2rem',
    transform: 'translate(0px, 0px) scale(0.75)',
    color: theme.palette.text.primary,
    '&.Mui-error': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-root': {
    fontWeight: 700,
    fontSize: '1.4rem',
    '&::before': {
      border: 'none',
    },
    '&::after': {
      borderColor: theme.palette.primary.main,
    },
    '& input': {
      padding: 0,
      color: theme.palette.secondary.main,
      '&[aria-invalid=true]': {
        color: theme.palette.primary.main,
      },
    },
    '&:hover::before': {
      borderColor: 'rgb(255,255,255,0.5)', //'transparent',
    },
    '&:hover::after': {
      borderColor: 'none', //'transparent',
    },
    '&.Mui-focused': {
      borderColor: '#00f', //'transparent',
    },
  },
});

const InstrumentList = ({oldName, path, presetType, index, updateHandler, rewriteName}) => {
  const [name, setName] = useState(rewriteName);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!name) setName(rewriteName);
  }, [rewriteName]);

  useEffect(() => {
    setError('');
    if (name && name.length > 0) {
      //eslint-disable-next-line
      let rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
      let rg2 = /^\./; // cannot start with dot (.)
      let rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
      if (!rg1.test(name)) {
        setError('Filename can\'t contain characters  / : * ? " < > |');
      } else if (rg2.test(name)) {
        setError('Filename cannot start with a dot');
      } else if (rg3.test(name)) {
        setError('Filename is forbidden');
      } else {
        setError('');
      }
    }
  }, [name]);
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
            <CssTextField
              error={!!error}
              helperText={error}
              label={oldName}
              size="small"
              variant="standard"
              onChange={e => setName(e.target.value)}
              value={name}
              onBlur={e => updateHandler(presetType, index, e.target.value)}
              onKeyDown={e => {
                if (e.code === 'Enter') {
                  e.target.blur();
                }
              }}
              InputProps={{
                endAdornment: <EditIcon sx={{pointerEvents: 'none'}} />,
              }}
            />
            <Typography
              fontWeight={300}
              fontSize="1rem"
              color="secondary.text"
              sx={{display: 'flex', alignItems: 'center'}}
            >
              <SdCardIcon
                fontSize="small"
                color="primary"
                sx={{mr: 0.5}}
              />
              {path}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
};

export default memo(InstrumentList, (prev, next) => prev.rewriteName == next.rewriteName);
