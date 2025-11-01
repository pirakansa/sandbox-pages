// Dashboard shell responsible for applying theme and session checks.
import theme from '../../utils/Theme.js';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import * as cookie from 'cookie';
import { Header, EnsureHeader } from '../../components/block/Header.jsx';
import MenuBtn from '../../components/atoms/MenuBtn.jsx';
import Dashboard from "./Dashboard.jsx";
import { v5 as uuidv5 } from 'uuid';

const NameScope = uuidv5(window.location.hostname, uuidv5.URL);

// Guard dashboard access by validating cookies and wiring layout.
function App() {

  const FULL_WIDTH_PROPERTY = {
    maxWidth: false,
    disableGutters: true,
  };

  const cookies = cookie.parse(document.cookie);
  if (!cookies[NameScope]) {
    location.replace('/login.html');
    return (<></>);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container {...FULL_WIDTH_PROPERTY} >

          <Header >
            <MenuBtn></MenuBtn>
          </Header>

          <EnsureHeader />

          <Dashboard />

          <EnsureHeader />

        </Container>
      </ThemeProvider>
    </>
  )
}

export default App
