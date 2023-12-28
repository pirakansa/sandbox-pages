import theme from '../../utils/Theme.js';
import Container from '@mui/material/Container';
import Dashboard from "./Dashboard.jsx";
import { ThemeProvider } from '@mui/material/styles';
import cookie from 'cookie';

function App() {

  const FULL_WIDTH_PROPERTY = {
    maxWidth: false,
    disableGutters: true,
  };

  const cookies = cookie.parse(document.cookie);
  if (!cookies.uuid) {
    location.replace('/login.html');
    return (<></>);
  }

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
