// Splash screen shell that shows the landing dashboard with global theme.
import theme from '../../utils/Theme.js';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import Dashboard from "./Dashboard.jsx";

// Wrap the splash dashboard with the shared layout and theme objects.
function App() {

  const FULL_WIDTH_PROPERTY = {
    maxWidth: false,
    disableGutters: true,
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container {...FULL_WIDTH_PROPERTY} >
          <Dashboard />
        </Container>
      </ThemeProvider>
    </>
  )
}

export default App
