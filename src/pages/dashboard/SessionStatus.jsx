// Session status page rendering Firebase auth snapshot only.
import { useCallback, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebaseClient.js';

/**
 * Render the Firebase auth UID with quick status refresh controls.
 */
export default function SessionStatus() {
  const [authSnapshot, setAuthSnapshot] = useState({
    status: 'checking',
    uid: null,
    error: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [busy, setBusy] = useState(false);

  const handleRefresh = useCallback(() => {
    setBusy(true);
    try {
      const currentUid = auth?.currentUser?.uid ?? null;
      setAuthSnapshot({
        status: 'ready',
        uid: currentUid,
        error: null
      });
      setSnackbar({
        open: true,
        message: '認証状態を再取得しました。',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error
          ? error.message
          : '認証状態の更新に失敗しました。',
        severity: 'error'
      });
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setAuthSnapshot({
          status: 'ready',
          uid: user?.uid ?? null,
          error: null
        });
      },
      (observerError) => {
        setAuthSnapshot({
          status: 'error',
          uid: null,
          error: observerError instanceof Error
            ? observerError.message
            : '認証状態の取得に失敗しました。'
        });
        setSnackbar({
          open: true,
          message: '認証状態の確認でエラーが発生しました。',
          severity: 'error'
        });
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleSnackbarClose = useCallback((_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 4,
          px: 2,
        }}
      >
        <Card
          elevation={4}
          sx={{
            width: '100%',
            maxWidth: 520,
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom>
              セッションステータス
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Firebase 認証で現在アクティブな UID を確認できます。
            </Typography>

            <Stack spacing={1.5} sx={{ mt: 3 }}>
              <div>
                <Typography variant="subtitle2" color="text.secondary">
                  Firebase認証のUID
                </Typography>
                {authSnapshot.status === 'checking' && (
                  <Typography variant="body2" color="text.secondary">
                    認証状態を確認しています…
                  </Typography>
                )}
                {authSnapshot.status === 'ready' && authSnapshot.uid && (
                  <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                    {authSnapshot.uid}
                  </Typography>
                )}
                {authSnapshot.status === 'ready' && !authSnapshot.uid && (
                  <Typography variant="body2" color="text.secondary">
                    認証済みユーザーは確認できませんでした。
                  </Typography>
                )}
                {authSnapshot.status === 'error' && (
                  <Typography variant="body2" color="error">
                    {authSnapshot.error}
                  </Typography>
                )}
              </div>
            </Stack>
          </CardContent>

          <CardActions sx={{ px: 3, pb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRefresh}
              disabled={busy}
              fullWidth
            >
              {busy ? <CircularProgress size={20} color="inherit" /> : '最新状態を再取得'}
            </Button>
          </CardActions>
        </Card>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
