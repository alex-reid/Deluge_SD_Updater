import {useState} from 'react';
import {Button, TextField, Typography} from '@mui/material';
import {setTitle} from '#preload';

const App = () => {
  const [title, setTheTitle] = useState('');
  return (
    <div>
      <Typography variant="h3">Deluge SD card Updater</Typography>
      <br />
      <Button
        variant="contained"
        onClick={() => setTitle(title)}
      >
        Hi There
      </Button>
      <br />
      <TextField
        variant="outlined"
        label="title"
        value={title}
        onChange={e => setTheTitle(e.target.value)}
      ></TextField>
    </div>
  );
};
export default App;
