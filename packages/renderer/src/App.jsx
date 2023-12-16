import {useState} from 'react';
import {Button, List, ListItem, ListItemText, TextField, Typography} from '@mui/material';
import {setTitle, sendFiles} from '#preload';

const App = () => {
  const [synths, setSynths] = useState([]);
  sendFiles(({kits, synths, songs}) => setSynths(synths));
  return (
    <div>
      <Typography variant="h3">Deluge SD card Updater</Typography>
      <br />
      <Button
        variant="contained"
        // onClick={() => setTitle(title)}
      >
        Hi There
      </Button>
      <br />
      <TextField
        variant="outlined"
        label="title"
        // value={title}
        // onChange={e => setTheTitle(e.target.value)}
      ></TextField>
      <br />
      <List dense>
        {synths.map(({name, path}, i) => (
          <ListItem
            key={i}
            sx={{borderBottom: '1px solid'}}
          >
            <ListItemText
              primary={name}
              secondary={path}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
export default App;
