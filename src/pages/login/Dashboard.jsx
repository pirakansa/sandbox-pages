// Simple login page that issues a session cookie on behalf of the user.
import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '../../services/firebaseClient.js';
import {
  createSessionCookie,
  removeSessionCookie
} from '../../services/session.js';
import styles from './Dashboard.module.scss';
import ThemeModeToggle from '../../components/atoms/ThemeModeToggle.jsx';

// Render the login button and register session cookies when invoked.
function DashboardContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const redirectHandledRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setAuthReady(true);
        setError(null);
        setIsProcessing(false);

        if (user) {
          createSessionCookie(user.uid);

          if (!redirectHandledRef.current && process.env.NODE_ENV !== 'test') {
            redirectHandledRef.current = true;
            setTimeout(() => {
              if (typeof window !== 'undefined' && window.location?.replace) {
                window.location.replace('/top.html');
              }
            }, 300);
          }
        } else {
          removeSessionCookie();
          redirectHandledRef.current = false;
        }
      },
      (observerError) => {
        console.error('Failed to observe auth state', observerError);
        setAuthReady(true);
        setError(observerError);
        setIsProcessing(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleLogin = useCallback(async () => {
    setError(null);
    setIsProcessing(true);
    try {
      await signInAnonymously(auth);
    } catch (loginError) {
      console.error('匿名ログインに失敗しました', loginError);
      setError(loginError);
      setIsProcessing(false);
    }
  }, []);

  const MARGIN_WIDTH_PROPERTY = {
    maxWidth: 'xl',
    disableGutters: false,
    sx: {
      my: 2, // mergin-y
    }
  };

  return (
    <>
      <Container {...MARGIN_WIDTH_PROPERTY} >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 2
          }}
        >
          <ThemeModeToggle size="small" />
        </Box>
        <Grid container>
          <Box className={styles.center} >

            <Stack spacing={2} alignItems="center">
              {!authReady && (
                <Typography>ログイン状態を確認しています…</Typography>
              )}

              {authReady && !currentUser && (
                <Button
                  variant="contained"
                  onClick={handleLogin}
                  disabled={isProcessing}
                >
                  ゲストパスで入室
                </Button>
              )}

              {authReady && currentUser && (
                <Typography>
                  ログインが完了しました。ダッシュボードへ移動します…
                </Typography>
              )}

              {error && (
                <Typography role="alert" color="error">
                  {error.message ?? '処理中にエラーが発生しました。'}
                </Typography>
              )}
            </Stack>
          </Box>
        </Grid>

      </Container>
    </>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
