import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Divider,
  Icon,
  Typography,
} from '@mui/material';
import React, {memo} from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Box} from '@mui/system';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import {InstrumentListSongList} from './SongListInstruments';
import Path from './Path';
import SongPreview from './SongPreview';

const SongList = ({name, path, instruments, clipsLength, firmwareVersion, previewData}) => {
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
            {previewData && (
              <SongPreview
                data={previewData}
                scale={5}
              />
            )}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.4rem',
                display: 'inline-block',
                lineHeight: 2,
                wordBreak: 'break-all',
                ml: 2,
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
        <Path path={path} />
        <Divider sx={{borderWidth: '1px'}} />
        <Box
          sx={{
            fontSize: '1rem',
          }}
        >
          {instruments.map((instrument, index) => (
            <InstrumentListSongList
              instrument={instrument}
              index={index}
              key={index}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default memo(SongList, (_prev, next) => !next.shouldUpdate);
