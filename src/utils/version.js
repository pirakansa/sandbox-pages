const DEFAULT_VERSION = 'dev';

/**
 * 現在のアプリケーションバージョンを取得します。
 * Vite で埋め込まれた環境変数を優先し、なければプロセス環境または既定値を返します。
 */
export function getAppVersion() {
  if (typeof globalThis !== 'undefined' && globalThis.__APP_VERSION__) {
    return globalThis.__APP_VERSION__;
  }

  if (typeof process !== 'undefined'
    && process.env
    && typeof process.env.APP_VERSION === 'string'
    && process.env.APP_VERSION.length > 0) {
    return process.env.APP_VERSION;
  }

  if (typeof import.meta !== 'undefined'
    && import.meta.env
    && import.meta.env.VITE_APP_VERSION) {
    return import.meta.env.VITE_APP_VERSION;
  }

  return DEFAULT_VERSION;
}

export { DEFAULT_VERSION };
