import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {IconButton, Paper} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  height: '80vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

export default function ExportPopup({open, handleClose, fileExport}) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Paper
          elevation={6}
          sx={style}
        >
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography
              variant="h5"
              component="h2"
            >
              Update Files
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{transform: 'translate(50%,-50%)'}}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{width: '100%', height: '100%', overflow: 'auto'}}>
            <Typography
              variant="h6"
              component="h3"
            >
              Synths
            </Typography>
            <pre>{JSON.stringify(fileExport.synthNames, null, 2)}</pre>
            <Typography
              variant="h6"
              component="h3"
            >
              Kits
            </Typography>
            <pre>{JSON.stringify(fileExport.kitNames, null, 2)}</pre>
            <Typography
              variant="h6"
              component="h3"
            >
              Songs
            </Typography>
            <pre>{JSON.stringify(fileExport.songInsts, null, 2)}</pre>
          </Box>
        </Paper>
      </Modal>
    </div>
  );
}
