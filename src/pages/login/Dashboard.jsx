// Simple login page that issues a session cookie on behalf of the user.
import PropTypes from 'prop-types';
import ThemeModeToggle from '../../components/atoms/ThemeModeToggle.jsx';
import { useLoginController } from './useLoginController.js';

function StatusMessage({ variant = 'info', children, role }) {
  const styles = {
    info:
      'border-blue-200 bg-blue-50 text-blue-800 shadow-blue-900/10 dark:border-blue-500/40 dark:bg-blue-900/40 dark:text-blue-100',
    success:
      'border-emerald-200 bg-emerald-50 text-emerald-800 shadow-emerald-900/10 dark:border-emerald-500/40 dark:bg-emerald-900/30 dark:text-emerald-100',
    error:
      'border-rose-200 bg-rose-50 text-rose-800 shadow-rose-900/10 dark:border-rose-500/40 dark:bg-rose-900/30 dark:text-rose-100'
  };
  return (
    <div
      className={`w-full rounded-2xl border px-4 py-3 text-sm shadow ${styles[variant] ?? styles.info}`}
      role={role}
    >
      {children}
    </div>
  );
}

StatusMessage.propTypes = {
  variant: PropTypes.oneOf(['info', 'success', 'error']),
  role: PropTypes.string,
  children: PropTypes.node
};

StatusMessage.defaultProps = {
  variant: 'info',
  role: undefined,
  children: null
};

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-6 py-6 text-slate-800 transition dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col">
        <div className="flex justify-end">
          <ThemeModeToggle size="small" />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md space-y-4 text-center">
            {!authReady && (
              <StatusMessage>
                ログイン状態を確認しています…
              </StatusMessage>
            )}

            {infoMessage && (
              <StatusMessage variant="success">
                {infoMessage}
              </StatusMessage>
            )}

            {authReady && !currentUser && (
              <form
                onSubmit={handleEmailLogin}
                noValidate
                className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-6 text-left shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <div className="space-y-1">
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    メールアドレス
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/40"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    disabled={isProcessing && !linkPending}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:opacity-70 dark:bg-blue-500 dark:text-slate-50 dark:hover:bg-blue-400"
                >
                  {linkPending ? 'ログインを完了' : 'ログインリンクを送信'}
                </button>

                <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={isProcessing}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:ring-blue-500/40"
                >
                  ゲストパスで入室
                </button>
              </form>
            )}

            {authReady && currentUser && (
              <StatusMessage variant="success">
                ログインが完了しました。ダッシュボードへ移動します…
              </StatusMessage>
            )}

            {error && (
              <StatusMessage variant="error" role="alert">
                {error.message ?? '処理中にエラーが発生しました。'}
              </StatusMessage>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
