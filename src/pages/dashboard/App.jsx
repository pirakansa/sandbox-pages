// Dashboard shell responsible for applying theme and session checks.
import Container from '@mui/material/Container';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Header, EnsureHeader } from '../../components/block/Header.jsx';
import MenuBtn from '../../components/atoms/MenuBtn.jsx';
import Dashboard from './Dashboard.jsx';
import { auth } from '../../services/firebaseClient.js';
import {
  getSessionCookieValue,
  removeSessionCookie
} from '../../services/session.js';
import { AppThemeProvider } from '../../utils/Theme.jsx';

function redirectToLogin() {
  if (typeof window !== 'undefined' && window.location?.replace) {
    window.location.replace('/login.html');
  }
}

// Guard dashboard access by validating cookies and wiring layout.
function App() {

  const FULL_WIDTH_PROPERTY = {
    maxWidth: false,
    disableGutters: true,
  };

  useEffect(() => {
    const cookieUserId = getSessionCookieValue();
    if (!cookieUserId) {
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        const latestCookieUserId = getSessionCookieValue();
        if (!user || !latestCookieUserId || user.uid !== latestCookieUserId) {
          removeSessionCookie();

          redirectToLogin();
        }
      },
      (observerError) => {
        console.error('Failed to observe auth state in dashboard', observerError);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const initialCookieUserId = getSessionCookieValue();
  if (!initialCookieUserId) {
    redirectToLogin();
    return (<></>);
  }

  return (
    <>
      <AppThemeProvider>
        <Container {...FULL_WIDTH_PROPERTY} >

          <Header>
            <MenuBtn />
          </Header>

          <EnsureHeader />

          <Dashboard />

          <EnsureHeader />

        </Container>
      </AppThemeProvider>
    </>
  )
}

export default App
