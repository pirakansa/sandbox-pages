// Splash screen shell that shows the landing dashboard with global theme.
import Container from '@mui/material/Container';
import Dashboard from "./Dashboard.jsx";
import { AppThemeProvider } from '../../utils/Theme.jsx';

// Wrap the splash dashboard with the shared layout and theme objects.
function App() {

  const FULL_WIDTH_PROPERTY = {
    maxWidth: false,
    disableGutters: true,
  };

  return (
    <>
      <AppThemeProvider>
        <Container {...FULL_WIDTH_PROPERTY} >
          <Dashboard />
        </Container>
      </AppThemeProvider>
    </>
  )
}

export default App
