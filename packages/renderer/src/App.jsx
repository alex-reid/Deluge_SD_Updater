import {useCallback, useEffect, useState} from 'react';
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

const App = () => {
  const [synths, setSynths] = useState([]);
  const [kits, setKits] = useState([]);
  const [songs, setSongs] = useState([]);
  const [tab, setTab] = useState('tab-synths');
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    console.log('songs data', songs);
  }, [songs]);
  useEffect(() => {
    console.log('synths data', synths);
  }, [synths]);
  useEffect(() => {
    console.log('kits data', kits);
  }, [kits]);

  const getInstNewName = ins => {
    const type = ins.type == 'kit' ? 'kits' : 'synths';
    let mapping = {name: ins.patchName, path: type.toUpperCase()};
    let sound = null;
    if (ins.type == 'kit') sound = kits[ins.soundID];
    if (ins.type == 'sound') sound = synths[ins.soundID];
    if (sound) {
      mapping = {name: sound.rewriteName, path: sound.path};
    }
    return mapping;
  };

  useEffect(() => {
    //console.log('songs', songs);
    rewriteSongs();
  }, [synths, kits]);

  const rewriteSongs = () => {
    console.log('try synth rewrite');
    setSongs(prev => {
      if (prev && prev.length > 0) {
        // check song isn't empty
        console.log('run synth rewrite');
        return prev.map(song => {
          let shouldUpdate = false;
          return {
            // map each song
            ...song,
            instruments: song.instruments.map(inst => {
              // remap each instrument
              const {name, path} = getInstNewName(inst);
              console.log(name, path, inst.rewriteName, inst.rewriteFolder);
              if (name != inst.rewriteName && path != inst.rewriteFolder) {
                shouldUpdate = true;
                return {
                  ...inst,
                  rewriteName: name,
                  rewriteFolder: path,
                };
              }
              return inst;
            }),
            shouldUpdate,
          };
        });
      }
      return prev;
    });
  };

  useEffect(() => {
    const initialise = ({initialised, kits, synths, songs}) => {
      console.log('handler attached', initialised);
      setInitialised(true);
      setSynths(synths);
      setKits(kits);
      setSongs(songs);
    };

    sendFiles(initialise);
    sendError(e => console.log(e.message, typeof e));

    return () => {
      // ipcRenderer.removeListener('files', initialise);
    };
  }, []);

  const handleChange = (_event, newValue) => {
    setTab(newValue);
  };

  const updateHandler = useCallback(
    (type, id, value) => {
      const setFuncCallback = prev => {
        return prev.map((old, i) => (i == id ? {...old, rewriteName: value} : old));
      };
      if (type == 'SYNT') {
        setSynths(setFuncCallback);
      }
      if (type == 'KIT') {
        setKits(setFuncCallback);
      }
    },
    [synths, kits],
  );

  const loadV4Names = () => {
    setSynths(prev => {
      return prev.map(old => ({
        ...old,
        rewriteName: old.rewriteName ? old.rewriteName : old.newName,
      }));
    });
    setKits(prev => {
      return prev.map(old => ({
        ...old,
        rewriteName: old.rewriteName ? old.rewriteName : old.newName,
      }));
    });
    // console.log(synths, kits);
  };

  const loadPrettyNames = () => {
    setSynths(prev => {
      return prev.map(old => ({
        ...old,
        rewriteName: old.rewriteName ? old.rewriteName : old.prettyName,
      }));
    });
    setKits(prev => {
      return prev.map(old => ({
        ...old,
        rewriteName: old.rewriteName ? old.rewriteName : old.prettyName,
      }));
    });
    // console.log(synths, kits);
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
                  onChange={handleChange}
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
                        updateHandler={updateHandler}
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
                        updateHandler={updateHandler}
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
                >
                  Prettify Old Names
                </Button>
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
