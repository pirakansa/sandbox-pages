// Simple login page that issues a session cookie on behalf of the user.
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import styles from './Dashboard.module.scss';
import ThemeModeToggle from '../../components/atoms/ThemeModeToggle.jsx';
import { useLoginController } from './useLoginController.js';

// Render the login button and register session cookies when invoked.
function DashboardContent() {
  const {
    authReady,
    currentUser,
    email,
    setEmail,
    infoMessage,
    error,
    isProcessing,
    linkPending,
    handleEmailLogin,
    handleGuestLogin
  } = useLoginController();

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
