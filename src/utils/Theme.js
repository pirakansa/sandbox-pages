// Shared MUI theme definition applied across every page.
import './Global.scss'
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default theme;
