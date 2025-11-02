// Session status page rendering Firebase auth snapshot only with theme controls.
import { useCallback, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { onAuthStateChanged } from 'firebase/auth';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
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
  const theme = useTheme();

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
          alignItems: 'flex-start',
          minHeight: '100%',
          py: { xs: 4, md: 6 },
          px: 2,
          bgcolor: 'background.default',
          transition: theme.transitions.create('background-color', {
            duration: theme.transitions.duration.shortest
          })
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 520
          }}
        >
          <CardHeader
            title="セッションステータス"
            subheader="Firebase 認証で現在アクティブな UID を確認できます。"
            sx={{
              alignItems: 'center',
              '& .MuiCardHeader-title': {
                fontWeight: 700,
                fontSize: '1.25rem'
              }
            }}
          />
          <Divider />
          <CardContent sx={{ pt: 3 }}>
            <Stack spacing={2}>
              <Stack spacing={0.5}>
                <Typography variant="subtitle2" color="text.secondary">
                  Firebase認証のUID
                </Typography>
                {authSnapshot.status === 'checking' && (
                  <Typography variant="body2" color="text.secondary">
                    認証状態を確認しています…
                  </Typography>
                )}
                {authSnapshot.status === 'ready' && authSnapshot.uid && (
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                  >
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
              </Stack>
            </Stack>
          </CardContent>

          <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRefresh}
              disabled={busy}
              fullWidth
              size="large"
            >
              {busy ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                '最新状態を再取得'
              )}
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
