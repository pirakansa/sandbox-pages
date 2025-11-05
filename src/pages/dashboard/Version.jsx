import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAppVersion } from '../../utils/version.js';
import { canClearSiteCaches, clearSiteCaches } from '../../utils/cacheControl.js';

const SNACKBAR_STYLES = {
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-900 shadow-emerald-900/10 dark:border-emerald-500/40 dark:bg-emerald-900/40 dark:text-emerald-100',
  error:
    'border-rose-200 bg-rose-50 text-rose-900 shadow-rose-900/10 dark:border-rose-500/40 dark:bg-rose-900/40 dark:text-rose-100',
  info:
    'border-sky-200 bg-sky-50 text-sky-900 shadow-sky-900/10 dark:border-sky-500/40 dark:bg-sky-900/40 dark:text-sky-100'
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-500" aria-hidden="true">
      <path
        d="M20 6 9 17l-5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-500" aria-hidden="true">
      <path
        d="M12 9v4m0 4h.01M10.3 4.6 3.3 16.6c-.78 1.35.18 3 1.7 3H19c1.52 0 2.48-1.65 1.7-3L13.7 4.6c-.78-1.35-2.62-1.35-3.4 0Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

  useEffect(() => {
    if (!snackbar.open) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 6000);
    return () => clearTimeout(timer);
  }, [snackbar.open]);

  return (
    <>
      <div className="mt-6 flex justify-center px-4">
        <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            バージョン情報
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            現在デプロイされているアプリのバージョンと、キャッシュの状態を確認できます。
          </p>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              現在のバージョン
            </p>
            <p className="mt-2 font-mono text-lg font-semibold text-slate-900 dark:text-slate-100">
              {versionLabel}
            </p>
          </div>

          <div className="my-6 h-px w-full bg-slate-200 dark:bg-slate-700" />

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            キャッシュについて
          </p>
          <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-3">
              <span className="mt-0.5">
                <CheckIcon />
              </span>
              <span>PWA の Cache Storage を削除して最新版を取得します。</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5">
                <WarningIcon />
              </span>
              <span>ブラウザ本体の HTTP キャッシュは安全性の理由で削除できません。</span>
            </li>
          </ul>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleClearCache}
              disabled={busy}
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:opacity-70 dark:bg-blue-500 dark:text-slate-50 dark:hover:bg-blue-400"
            >
              {busy ? (
                <>
                  <span className="sr-only">キャッシュ削除中</span>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                </>
              ) : (
                'キャッシュを削除して更新'
              )}
            </button>
          </div>
        </section>
      </div>

      {snackbar.open && (
        <div className="fixed inset-x-0 bottom-6 flex justify-center px-4">
          <div
            className={`relative w-full max-w-md rounded-2xl border px-4 py-3 text-sm shadow-xl ${SNACKBAR_STYLES[snackbar.severity] ?? SNACKBAR_STYLES.info}`}
            role="status"
            aria-live="assertive"
          >
            <p>{snackbar.message}</p>
            <button
              type="button"
              onClick={handleSnackbarClose}
              className="absolute right-3 top-3 rounded-full p-1 text-current transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/60"
              aria-label="通知を閉じる"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
