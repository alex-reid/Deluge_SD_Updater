import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useState} from 'react';
import {exportFiles} from '#preload';
import theme from '../theme';

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
  const [confirm, setConfirm] = useState(false);

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
          {fileExport.synthNames && fileExport.kitNames && fileExport.songInsts && (
            <Box
              sx={{
                width: '100%',
                height: '100%',
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
              <Accordion TransitionProps={{timeout: 300}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      width: '33%',
                      minWidth: '200px',
                    }}
                  >
                    Synths
                  </Typography>
                  <Typography component="h3">
                    Updating {fileExport.info.synthsToUpdate} out of {fileExport.info.synthsTotal}{' '}
                    Synths
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* <pre>{JSON.stringify(fileExport.synthNames, null, 2)}</pre> */}
                  <List dense>
                    {fileExport.synthNames &&
                      fileExport.synthNames.map((synth, index) => (
                        <Box key={index}>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography color={synth.willUpdate ? 'secondary' : ''}>
                                  {synth.oldName} &rarr; <strong>{synth.rewriteName}</strong>
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption">
                                  {synth.oldPath} &rarr; <strong>{synth.rewriteFolder}</strong>
                                </Typography>
                              }
                            />
                          </ListItem>
                          <Divider />
                        </Box>
                      ))}
                  </List>
                </AccordionDetails>
              </Accordion>
              <Accordion TransitionProps={{timeout: 300}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      width: '33%',
                      minWidth: '200px',
                    }}
                  >
                    Kits
                  </Typography>
                  <Typography component="h3">
                    Updating {fileExport.info.kitsToUpdate} out of {fileExport.info.kitsTotal} Kits
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* <pre>{JSON.stringify(fileExport.kitNames, null, 2)}</pre> */}
                  <List dense>
                    {fileExport.kitNames &&
                      fileExport.kitNames.map((kit, index) => (
                        <Box key={index}>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography color={kit.willUpdate ? 'secondary' : ''}>
                                  {kit.oldName} &rarr; <strong>{kit.rewriteName}</strong>
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption">
                                  {kit.oldPath} &rarr; <strong>{kit.rewriteFolder}</strong>
                                </Typography>
                              }
                            />
                          </ListItem>
                          <Divider />
                        </Box>
                      ))}
                  </List>
                </AccordionDetails>
              </Accordion>
              <Accordion TransitionProps={{timeout: 300}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      width: '33%',
                      minWidth: '200px',
                    }}
                  >
                    Songs
                  </Typography>
                  <Typography component="h3">
                    Updating {fileExport.info.songsToUpdate} out of {fileExport.info.songsTotal}{' '}
                    Songs
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {fileExport.songInsts.map((song, index) => (
                    <Box key={index}>
                      <Typography variant="h5">{song.name}</Typography>
                      <Typography variant="h6">{song.path}</Typography>
                      <List dense>
                        {song.instruments.map((inst, index) => (
                          <Box key={index}>
                            <ListItem>
                              <ListItemText
                                primary={
                                  <Typography
                                    sx={{m: 0, p: 0}}
                                    color={inst.updateName ? 'secondary' : ''}
                                  >
                                    {inst.rewriteName}
                                  </Typography>
                                }
                                secondary={
                                  <Typography
                                    sx={{m: 0, p: 0}}
                                    color={inst.updateFolder ? 'secondary' : ''}
                                    variant="caption"
                                  >
                                    {inst.rewriteFolder}
                                  </Typography>
                                }
                              />
                            </ListItem>
                            <Divider />
                          </Box>
                        ))}
                      </List>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
          <Box sx={{display: 'flex', justifyContent: 'space-between', pt: 2}}>
            <FormGroup>
              <FormControlLabel
                required
                control={
                  <Checkbox
                    checked={confirm}
                    onChange={() => setConfirm(!confirm)}
                  />
                }
                label="I have backed up my SD card"
              />
            </FormGroup>
            <Button
              variant="contained"
              disabled={!confirm}
              onClick={() => exportFiles(fileExport)}
            >
              Update Files
            </Button>
          </Box>
        </Paper>
      </Modal>
    </div>
  );
}
