import {useEffect, useState} from 'react';
import {Box, Typography, Button, LinearProgress} from '@mui/material';
import {init, sendError, openBroswer} from '#preload';
import SdCardIcon from '@mui/icons-material/SdCard';

export const DragBox = () => {
  const [hover, setHover] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    sendError(err => {
      setLoading(false);
      setErrorText(err.message);
    });
    import.meta.env.VITE_LOAD_DUMMY_SD_ON_APP_OPEN === true &&
      init(import.meta.env.VITE_DUMMY_SD_DIR);
  }, []);

  return (
    <Box
      sx={{
        width: 'auto',
        flex: '1 1 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px dashed #fff',
        borderColor: hover ? 'secondary.light' : 'primary.light',
        borderRadius: '2rem',
        m: 6,
      }}
      onDrop={ev => {
        ev.preventDefault();
        setHover(false);
        setLoading(true);
        init(ev.dataTransfer.files[0].path);
      }}
      onDragOver={ev => {
        ev.preventDefault();
        setHover(true);
      }}
      onDragLeave={ev => {
        ev.preventDefault();
        setHover(false);
      }}
    >
      <Box sx={{textAlign: 'center'}}>
        <SdCardIcon
          color="secondary"
          sx={{fontSize: '6rem'}}
        />
        <Typography variant="h4">Drag your Deluge SD card here</Typography>
        <Typography
          variant="h5"
          sx={{fontSize: 20}}
        >
          (Or a directory containing your SD card files)
        </Typography>
        {loading && (
          <Box sx={{m: 2}}>
            <LinearProgress />
          </Box>
        )}
        <br />
        {import.meta.env.VITE_DUMMY_SD_DIR && (
          <Button
            variant="contained"
            size="small"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              init(import.meta.env.VITE_DUMMY_SD_DIR);
            }}
          >
            Load Dummy SD card
          </Button>
        )}
        <Button
          variant="contained"
          size="small"
          disabled={loading}
          onClick={() => {
            openBroswer();
          }}
        >
          Click here to browse instead
        </Button>
        {errorText && (
          <Typography
            variant="h6"
            color="primary"
            marginTop={2}
          >
            <strong>Error Loading Files:</strong> {errorText}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
