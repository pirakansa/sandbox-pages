import { useCallback, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { getAppVersion } from '../../utils/version.js';
import { canClearSiteCaches, clearSiteCaches } from '../../utils/cacheControl.js';

/**
 * バージョン情報とキャッシュ削除操作を提供する専用ページ。
 */
export default function Version() {
  const versionLabel = useMemo(() => getAppVersion(), []);
  const cacheSupported = canClearSiteCaches();
  const [busy, setBusy] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const handleSnackbarClose = useCallback((_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const handleClearCache = useCallback(async () => {
    if (!cacheSupported) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'このブラウザではキャッシュ削除に対応していません。',
      });
      return;
    }

    setBusy(true);
    try {
      const { total, deleted } = await clearSiteCaches();
      const cacheSummary = total > 0
        ? `${deleted}/${total} 件のキャッシュを削除しました。`
        : '削除対象のキャッシュはありませんでした。';

      setSnackbar({
        open: true,
        severity: 'success',
        message: `${cacheSummary}ページを再読み込みします。`,
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: error instanceof Error
          ? error.message
          : 'キャッシュの削除に失敗しました。',
      });
    } finally {
      setBusy(false);
    }
  }, [cacheSupported]);

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
              バージョン情報
            </Typography>
            <Typography variant="body1" color="text.secondary">
              現在デプロイされているアプリのバージョンと、キャッシュの状態を確認できます。
            </Typography>

            <Box sx={{ mt: 3, mb: 1.5 }}>
              <Typography variant="subtitle2" color="text.secondary">
                現在のバージョン
              </Typography>
              <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                {versionLabel}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="text.secondary">
              キャッシュについて
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="PWA の Cache Storage を削除して最新版を取得します。"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WarningAmberIcon color="warning" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="ブラウザ本体の HTTP キャッシュは安全性の理由で削除できません。"
                />
              </ListItem>
            </List>
          </CardContent>

          <CardActions sx={{ px: 3, pb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClearCache}
              disabled={busy}
              fullWidth
            >
              {busy ? <CircularProgress size={20} color="inherit" /> : 'キャッシュを削除して更新'}
            </Button>
          </CardActions>
        </Card>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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
