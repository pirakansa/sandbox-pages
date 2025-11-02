// Login app shell applying the shared theme around the dashboard view.
import Container from '@mui/material/Container';
import Dashboard from "./Dashboard.jsx";
import { AppThemeProvider } from '../../utils/Theme.jsx';

// Provide theming and consistent layout for the login dashboard.
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
