import theme from '../../utils/Theme.js';
import Container from '@mui/material/Container';
import Dashboard from "./Dashboard.jsx";
import { ThemeProvider } from '@mui/material/styles';

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
