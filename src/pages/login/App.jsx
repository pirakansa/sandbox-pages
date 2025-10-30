// Login app shell applying the shared theme around the dashboard view.
import theme from '../../utils/Theme.js';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import Dashboard from "./Dashboard.jsx";

// Provide theming and consistent layout for the login dashboard.
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
