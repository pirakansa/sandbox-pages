// Simple login page that issues a session cookie on behalf of the user.
import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInAnonymously,
  signInWithEmailLink
} from 'firebase/auth';
import { auth } from '../../services/firebaseClient.js';
import {
  createSessionCookie,
  removeSessionCookie
} from '../../services/session.js';
import styles from './Dashboard.module.scss';
import ThemeModeToggle from '../../components/atoms/ThemeModeToggle.jsx';

const LOGIN_EMAIL_STORAGE_KEY = 'loginEmailAddress';

function resolveActionCodeSettings() {
  const FALLBACK_URL = 'http://localhost/login.html';
  if (typeof window === 'undefined') {
    return {
      url: FALLBACK_URL,
      handleCodeInApp: true
    };
  }

  const origin = window.location?.origin ?? '';
  const continueUrl = origin ? `${origin}/login.html` : FALLBACK_URL;
  return {
    url: continueUrl,
    handleCodeInApp: true
  };
}

// Render the login button and register session cookies when invoked.
function DashboardContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState('');
  const [linkPending, setLinkPending] = useState(false);
  const redirectHandledRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setAuthReady(true);
        setError(null);
        setInfoMessage(null);
        setIsProcessing(false);

        if (user) {
          setLinkPending(false);
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
        setLinkPending(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const currentUrl = window.location?.href ?? '';
    if (!currentUrl) {
      return;
    }

    if (!isSignInWithEmailLink(auth, currentUrl)) {
      return;
    }

    const storedEmail = window.localStorage?.getItem(LOGIN_EMAIL_STORAGE_KEY);
    if (storedEmail) {
      setEmail(storedEmail);
      setIsProcessing(true);
      signInWithEmailLink(auth, storedEmail, currentUrl)
        .then(() => {
          window.localStorage?.removeItem(LOGIN_EMAIL_STORAGE_KEY);
        })
        .catch((linkError) => {
          console.error('メールリンクでのログインに失敗しました', linkError);
          setError(linkError);
          setIsProcessing(false);
          setLinkPending(true);
        });
    } else {
      setLinkPending(true);
      setInfoMessage('メールアドレスを入力してログインを完了してください。');
    }
  }, []);

  const handleEmailLogin = useCallback(async (event) => {
    event?.preventDefault();
    setError(null);
    setInfoMessage(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError(new Error('メールアドレスを入力してください。'));
      return;
    }

    setIsProcessing(true);
    try {
      if (linkPending) {
        if (typeof window === 'undefined') {
          throw new Error('メールリンクを処理できません。ブラウザからアクセスしてください。');
        }
        await signInWithEmailLink(auth, trimmedEmail, window.location.href);
        window.localStorage?.removeItem(LOGIN_EMAIL_STORAGE_KEY);
      } else {
        await sendSignInLinkToEmail(auth, trimmedEmail, resolveActionCodeSettings());
        if (typeof window !== 'undefined') {
          window.localStorage?.setItem(LOGIN_EMAIL_STORAGE_KEY, trimmedEmail);
        }
        setInfoMessage('ログインリンクをメールで送信しました。メールをご確認ください。');
      }
    } catch (loginError) {
      console.error('メールリンクの送信・処理に失敗しました', loginError);
      setError(loginError);
      setIsProcessing(false);
      if (!linkPending) {
        setLinkPending(false);
      }
      return;
    }

    if (!linkPending) {
      setIsProcessing(false);
    }
  }, [email, linkPending]);

  const handleGuestLogin = useCallback(async () => {
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
              {infoMessage && (
                <Typography color="primary">{infoMessage}</Typography>
              )}

              {authReady && !currentUser && (
                <Box
                  component="form"
                  onSubmit={handleEmailLogin}
                  sx={{ width: 'min(320px, 90vw)' }}
                  noValidate
                >
                  <Stack spacing={2}>
                    <TextField
                      label="メールアドレス"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      fullWidth
                      disabled={isProcessing && !linkPending}
                      required
                    />
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={isProcessing}
                    >
                      {linkPending ? 'ログインを完了' : 'ログインリンクを送信'}
                    </Button>
                    <Button
                      variant="text"
                      onClick={handleGuestLogin}
                      disabled={isProcessing}
                    >
                      ゲストパスで入室
                    </Button>
                  </Stack>
                </Box>
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
