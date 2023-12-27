import SdCardIcon from '@mui/icons-material/SdCard';
import {Typography} from '@mui/material';

export default function Path({path}) {
  return (
    <Typography
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        textAlign: 'right',
        width: '100%',
        fontSize: '1rem',
      }}
    >
      Path:
      <SdCardIcon
        fontSize="small"
        color="primary"
        sx={{mx: 0.5}}
      />
      /{path}/
    </Typography>
  );
}
