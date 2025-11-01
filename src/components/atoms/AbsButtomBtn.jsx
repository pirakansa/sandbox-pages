// Prominent absolute-positioned button used for camera controls.
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import { deepOrange, grey } from '@mui/material/colors';
import PropTypes from 'prop-types';

AbsButtomBtn.propTypes = {
  onclick: PropTypes.any
};

// Render the floating button and propagate click events to parents.
export default function AbsButtomBtn({onclick}) {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        textAlign: 'center',
        width: '100vw',
      }}
    >
      <IconButton
        onClick={onclick}
      >
        < DoDisturbOnIcon
          sx={{
            borderRadius: 50,
            fontSize: 120,
            color: grey[300],
            bgcolor: deepOrange[500],
          }}
        />
      </IconButton>
    </Box>
  );
}
