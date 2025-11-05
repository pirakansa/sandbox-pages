// Session status page rendering Firebase auth snapshot only with theme controls.
import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebaseClient.js';

const SNACKBAR_STYLES = {
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-900 shadow-emerald-900/10 dark:border-emerald-500/40 dark:bg-emerald-900/40 dark:text-emerald-100',
  error:
    'border-rose-200 bg-rose-50 text-rose-900 shadow-rose-900/10 dark:border-rose-500/40 dark:bg-rose-900/40 dark:text-rose-100',
  info:
    'border-sky-200 bg-sky-50 text-sky-900 shadow-sky-900/10 dark:border-sky-500/40 dark:bg-sky-900/40 dark:text-sky-100',
  warning:
    'border-amber-200 bg-amber-50 text-amber-900 shadow-amber-900/10 dark:border-amber-500/40 dark:bg-amber-900/40 dark:text-amber-100'
};

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

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  useEffect(() => {
    if (!snackbar.open) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 4000);
    return () => clearTimeout(timer);
  }, [snackbar.open]);

  return (
    <>
      <div className="flex justify-center px-4 py-6 md:py-10">
        <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 transition dark:border-slate-800 dark:bg-slate-900">
          <header className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              セッションステータス
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Firebase 認証で現在アクティブな UID を確認できます。
            </p>
          </header>

          <div className="px-6 py-5">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Firebase認証のUID
                </p>
                {authSnapshot.status === 'checking' && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    認証状態を確認しています…
                  </p>
                )}
                {authSnapshot.status === 'ready' && authSnapshot.uid && (
                  <p className="break-all font-mono text-base font-semibold text-slate-900 dark:text-slate-100">
                    {authSnapshot.uid}
                  </p>
                )}
                {authSnapshot.status === 'ready' && !authSnapshot.uid && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    認証済みユーザーは確認できませんでした。
                  </p>
                )}
                {authSnapshot.status === 'error' && (
                  <p className="text-sm text-rose-600 dark:text-rose-300">
                    {authSnapshot.error}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 px-6 py-5 dark:border-slate-800">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={busy}
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:opacity-70 dark:bg-blue-500 dark:text-slate-50 dark:hover:bg-blue-400"
            >
              {busy ? (
                <>
                  <span className="sr-only">再取得中</span>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                </>
              ) : (
                '最新状態を再取得'
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
