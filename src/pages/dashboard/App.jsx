import theme from '../../utils/Theme.js';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import cookie from 'cookie';
import { Header, EnsureHeader } from '../../components/block/Header.jsx';
import MenuBtn from '../../components/atoms/MenuBtn.jsx';
import Dashboard from "./Dashboard.jsx";

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
