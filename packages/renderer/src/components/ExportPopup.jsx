import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
          {fileExport.synthNames && fileExport.kitNames && fileExport.songInsts && (
            <Box sx={{width: '100%', height: '100%', overflow: 'auto'}}>
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
                                  {synth.oldName} &gt; <strong>{synth.rewriteName}</strong>
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption">
                                  {synth.oldPath} &gt; <strong>{synth.rewriteFolder}</strong>
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
                                  {kit.oldName} &gt; <strong>{kit.rewriteName}</strong>
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption">
                                  {kit.oldPath} &gt; <strong>{kit.rewriteFolder}</strong>
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
                  >
                    Songs
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <pre>{JSON.stringify(fileExport.songInsts, null, 2)}</pre>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </Paper>
      </Modal>
    </div>
  );
}
