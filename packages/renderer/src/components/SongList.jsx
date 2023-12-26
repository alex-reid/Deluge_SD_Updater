import {Accordion, AccordionDetails, AccordionSummary, Chip, Icon, Typography} from '@mui/material';
import React, {memo} from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Box} from '@mui/system';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SdCardIcon from '@mui/icons-material/SdCard';
import {InstrumentListSongList} from './InstrumentListSongList';

const SongList = ({name, path, instruments, clipsLength, firmwareVersion, newInstNames}) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            mr: 2,
          }}
        >
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Icon
              color="primary"
              sx={{mr: 3}}
            >
              <LibraryMusicIcon />
            </Icon>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.4rem',
                display: 'inline-block',
                lineHeight: 2,
                wordBreak: 'break-all',
              }}
              component="span"
            >
              {name}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
            }}
            component="div"
          >
            <div>Firmware:</div>&ensp;
            <Chip
              color="secondary"
              label={firmwareVersion.join('.')}
              size="small"
            />
            <div>&emsp;Instruments:&ensp;</div>
            <Chip
              color="primary"
              label={instruments.length}
              size="small"
            />
            <div>&emsp;Clips:&ensp;</div>
            <Chip
              color="primary"
              label={clipsLength}
              size="small"
            />
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography
          fontWeight={300}
          color="secondary.text"
          sx={{display: 'flex', alignItems: 'center'}}
        >
          Path:
          <SdCardIcon
            fontSize="small"
            color="primary"
            sx={{mx: 0.5}}
          />
          {path}
        </Typography>
        <Box
          sx={{
            fontSize: '1rem',
          }}
        >
          {instruments.map((instrument, index) => (
            <InstrumentListSongList
              instrument={instrument}
              index={index}
              newInstNames={newInstNames}
              key={index}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default memo(SongList, (_prev, next) => !next.shouldUpdate);
