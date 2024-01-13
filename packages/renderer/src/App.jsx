import {useEffect, useReducer, useState} from 'react';
import {
  List,
  Tabs,
  Tab,
  Container,
  Box,
  ThemeProvider,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import {sendFiles, sendError} from '#preload';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import InstrumentList from './components/instrumentList';
import SongList from './components/SongList';
import {DragBox} from './components/DragBox';
import {INST, instrumentReducer, SONG, songReducer} from './reducers/reducers';
import ExportPopup, {getFileExportInfo} from './components/ExportPopup';

const App = () => {
  const [synths, dispatchSynths] = useReducer(instrumentReducer, []);
  const [kits, dispatchKits] = useReducer(instrumentReducer, []);
  const [songs, dispatchSongs] = useReducer(songReducer, []);
  const [tab, setTab] = useState('tab-synths');
  const [initialised, setInitialised] = useState(false);
  const [fileExport, setFileExport] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // useEffect(() => {
  //   console.log('songs data', songs);
  // }, [songs]);
  // useEffect(() => {
  //   console.log('synths data', synths);
  // }, [synths]);
  // useEffect(() => {
  //   console.log('kits data', kits);
  // }, [kits]);

  useEffect(() => {
    if (Object.keys(fileExport).length != 0) {
      console.log(fileExport);
      handleOpen();
    }
  }, [fileExport]);

  useEffect(() => {
    dispatchSongs({type: SONG.RENAME_FROM_INST, synths, kits});
  }, [synths, kits]);

  useEffect(() => {
    const initialise = ({initialised, kits, synths, songs}) => {
      console.log('handler attached', initialised);
      setInitialised(true);
      dispatchSynths({type: INST.LOAD_DATA, payload: synths});
      dispatchKits({type: INST.LOAD_DATA, payload: kits});
      dispatchSongs({type: SONG.LOAD_DATA, payload: songs});
    };

    sendFiles(initialise);
    sendError(e => console.log(e.message, typeof e));
  }, []);

  const doExport = () => {
    setFileExport(getFileExportInfo(synths, kits, songs));
  };

  const handleTabChange = (_event, newValue) => {
    setTab(newValue);
  };

  const updateSynth = (id, value) => {
    dispatchSynths({type: INST.RENAME_SINGLE, id, value});
  };

  const updateKit = (id, value) => {
    dispatchKits({type: INST.RENAME_SINGLE, id, value});
  };

  const loadV4Names = () => {
    dispatchSynths({type: INST.RENAME_ALL_V4});
    dispatchKits({type: INST.RENAME_ALL_V4});
  };

  const loadPrettyNames = () => {
    dispatchSynths({type: INST.RENAME_ALL_PRETTY});
    dispatchKits({type: INST.RENAME_ALL_PRETTY});
    dispatchSongs({type: SONG.RENAME_ALL_PRETTY});
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false}>
        <Box
          sx={{
            height: '100vh',
            maxHeight: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{p: 2, flex: '0 0 auto', display: 'flex', justifyContent: 'space-between'}}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.2rem',
              }}
            >
              Deluge SD Card Updater
            </Typography>
          </Box>
          {initialised ? (
            <>
              <Box sx={{borderBottom: 1, borderColor: 'divider', flex: '0 0 auto'}}>
                <Tabs
                  value={tab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                >
                  <Tab
                    label="Synths"
                    id="tab-synths"
                    value="tab-synths"
                  />
                  <Tab
                    label="Kits"
                    id="tab-kits"
                    value="tab-kits"
                  />
                  <Tab
                    label="Songs"
                    id="tab-songs"
                    value="tab-songs"
                  />
                </Tabs>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  flex: '1 1 auto',
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '0.8rem',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(255,255,255,.1)',
                    borderRadius: '0.4rem',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '0.4rem',
                  },
                }}
              >
                <Paper
                  style={{
                    display: tab == 'tab-synths' ? 'block' : 'none',
                  }}
                >
                  <List dense>
                    {synths.map((data, i) => (
                      <InstrumentList
                        {...data}
                        index={i}
                        key={i}
                        updateHandler={updateSynth}
                      />
                    ))}
                  </List>
                </Paper>
                <Paper
                  style={{
                    display: tab == 'tab-kits' ? 'block' : 'none',
                  }}
                >
                  <List dense>
                    {kits.map((data, i) => (
                      <InstrumentList
                        {...data}
                        index={i}
                        key={i}
                        updateHandler={updateKit}
                      />
                    ))}
                  </List>
                </Paper>
                <div
                  style={{
                    display: tab == 'tab-songs' ? 'block' : 'none',
                  }}
                >
                  {songs.map((data, i) => {
                    return (
                      <SongList
                        {...data}
                        key={i}
                      />
                    );
                  })}
                </div>
              </Box>

              <Box m={2}>
                <Button
                  variant="contained"
                  onClick={loadV4Names}
                  size="small"
                  color="secondary"
                  sx={{mr: 2}}
                >
                  Load V4 Names
                </Button>
                <Button
                  variant="contained"
                  onClick={loadPrettyNames}
                  size="small"
                  color="secondary"
                  sx={{mr: 4}}
                >
                  Prettify Old Names
                </Button>
                <Button
                  variant="contained"
                  onClick={doExport}
                  size="small"
                  color="primary"
                >
                  Update Files
                </Button>
                <ExportPopup
                  open={open}
                  handleClose={handleClose}
                  fileExport={fileExport}
                />
              </Box>
            </>
          ) : (
            <DragBox />
          )}
          <Box sx={{p: 1, flex: '0 0 auto', textAlign: 'center'}}>
            <Typography
              variant="subtitle2"
              sx={{display: 'inline-block'}}
            >
              This software is in an early alpha phase.
            </Typography>{' '}
            <Typography
              variant="subtitle2"
              sx={{display: 'inline-block'}}
              color="primary"
            >
              Please ensure you have backed up your SD card before using
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
export default App;
