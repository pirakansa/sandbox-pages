import * as cookie from 'cookie';
import { v5 as uuidv5 } from 'uuid';

// UUID名前空間をホスト名から生成し、環境ごとに異なるCookie名を割り当てる。
const host =
  typeof window !== 'undefined' && window.location?.hostname
    ? window.location.hostname
    : 'localhost';

const SESSION_COOKIE_NAME = uuidv5(host, uuidv5.URL);
const COOKIE_TTL_SECONDS = 60 * 30;
const SESSION_COOKIE_OPTIONS = {
  maxAge: COOKIE_TTL_SECONDS,
  path: '/'
};

function writeSessionCookie(sessionId) {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = cookie.serialize(
    SESSION_COOKIE_NAME,
    sessionId,
    SESSION_COOKIE_OPTIONS
  );
}

// ユーザーIDをCookieへ保存する。
export function createSessionCookie(userId) {
  if (!userId) {
    throw new Error('userId is required to create a session cookie.');
  }

  writeSessionCookie(userId);
  return userId;
}

// ログアウト時に同名Cookieを即時失効させる。
export function removeSessionCookie() {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = cookie.serialize(SESSION_COOKIE_NAME, '', {
    maxAge: 0,
    path: '/'
  });
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export { COOKIE_TTL_SECONDS };
