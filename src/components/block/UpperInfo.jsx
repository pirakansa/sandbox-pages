// Informational alert banner pinned near the top of the viewport.
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

UpperInfo.propTypes = {
  children: PropTypes.any
};

// Display its children inside an info-styled Material UI alert.
export default function UpperInfo(prop) {
  return (
    <Alert
      variant="standard"
      severity="info"
      sx={{
        position: 'absolute',
        width: '100%',
        top: 16
      }}
    >
      <AlertTitle>Scanned</AlertTitle>
      {prop.children}
    </Alert>
  );
}
