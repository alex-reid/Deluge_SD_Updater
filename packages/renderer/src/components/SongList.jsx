import {Accordion, AccordionDetails, AccordionSummary, Chip, Icon, Typography} from '@mui/material';
import React, {memo} from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Box} from '@mui/system';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';

const SongList = ({name, path, instruments, clips, firmwareVersion}) => {
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
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '1.6rem',
              display: 'inline-block',
              lineHeight: 2,
            }}
            component="span"
          >
            <Icon
              color="primary"
              sx={{mr: 3}}
            >
              <QueueMusicIcon />
            </Icon>
            {name}
          </Typography>
          <Typography
            sx={{
              fontSize: '1rem',
            }}
            component="span"
          >
            Firmware:&ensp;
            <Chip
              color="secondary"
              label={firmwareVersion.join('.')}
              size="small"
            />
            &emsp; Instruments:&ensp;
            <Chip
              color="primary"
              label={instruments.length}
              size="small"
            />
            &emsp; Clips:&ensp;
            <Chip
              color="primary"
              label={clips.length}
              size="small"
            />
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{path}</Typography>
        <Typography
          variant="h6"
          color="secondary"
        >
          instruments
        </Typography>
        <Typography
          component="pre"
          sx={{
            fontSize: '0.8rem',
          }}
        >
          {instruments.map((instrument, index) => (
            <pre key={index}>
              {index}. {JSON.stringify(instrument, null, 2)}
            </pre>
          ))}
        </Typography>
        <Typography
          variant="h6"
          color="secondary"
        >
          clips
        </Typography>
        <Typography
          component="pre"
          sx={{
            fontSize: '0.8rem',
          }}
        >
          {clips.map((clip, index) => (
            <pre key={index}>
              {index}. {JSON.stringify(clip, null, 2)}
            </pre>
          ))}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default memo(SongList);
