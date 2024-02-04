import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { ThemeProvider, createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

UpperInfo.propTypes = {
  children: PropTypes.any
};

export default function UpperInfo(prop) {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}