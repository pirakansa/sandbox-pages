import { act, render } from '@testing-library/react';
import { afterEach, afterAll, beforeEach, describe, expect, test, vi } from 'vitest';

import App from '../App.jsx';
import * as sessionModule from '../../../services/session.js';

const {
  mockOnAuthStateChanged
} = vi.hoisted(() => ({
  mockOnAuthStateChanged: vi.fn()
}));

let authObserver;

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args) => {
    const unsubscribe = vi.fn();
    mockOnAuthStateChanged(...args);
    authObserver = typeof args[1] === 'function' ? args[1] : undefined;
    return unsubscribe;
  }
}));

vi.mock('../../../services/firebaseClient.js', () => ({
  auth: {}
}));

describe('Dashboard App authentication guard', () => {
  let replaceSpy;
  const originalLocation = window.location;

  const sessionCookieName = sessionModule.getSessionCookieName();
  const removeSessionCookieSpy = vi.spyOn(sessionModule, 'removeSessionCookie');
  const getSessionCookieValueSpy = vi.spyOn(sessionModule, 'getSessionCookieValue');

  beforeEach(() => {
    mockOnAuthStateChanged.mockReset();
    removeSessionCookieSpy.mockClear();
    getSessionCookieValueSpy.mockClear();
    authObserver = undefined;
    replaceSpy = vi.fn();

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        replace: replaceSpy,
        hostname: originalLocation.hostname ?? 'localhost',
        href: originalLocation.href ?? 'http://localhost',
        assign: originalLocation.assign
          ? originalLocation.assign.bind(originalLocation)
          : vi.fn(),
        reload: originalLocation.reload
          ? originalLocation.reload.bind(originalLocation)
          : vi.fn()
      }
    });

    document.cookie = `${sessionCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation
    });
  });

  test('セッションCookieが無ければログイン画面へリダイレクトする', () => {
    render(<App />);

    expect(replaceSpy).toHaveBeenCalledWith('/login.html');
    expect(mockOnAuthStateChanged).not.toHaveBeenCalled();
    expect(removeSessionCookieSpy).not.toHaveBeenCalled();
  });

  test('認証状態が未ログインへ変化したらCookieを削除してログイン画面へ遷移する', async () => {
    document.cookie = `${sessionCookieName}=test-user; path=/`;

    render(<App />);

    expect(mockOnAuthStateChanged).toHaveBeenCalled();
    await act(async () => {
      authObserver?.(null);
    });

    expect(removeSessionCookieSpy).toHaveBeenCalledTimes(1);
    expect(replaceSpy).toHaveBeenCalledWith('/login.html');
  });

  test('CookieのUIDと認証済みユーザーのUIDが一致しなければログイン画面へ遷移する', async () => {
    document.cookie = `${sessionCookieName}=cookie-user; path=/`;

    render(<App />);

    expect(mockOnAuthStateChanged).toHaveBeenCalled();
    await act(async () => {
      authObserver?.({ uid: 'auth-user' });
    });

    expect(removeSessionCookieSpy).toHaveBeenCalledTimes(1);
    expect(replaceSpy).toHaveBeenCalledWith('/login.html');
  });

  afterAll(() => {
    removeSessionCookieSpy.mockRestore();
    getSessionCookieValueSpy.mockRestore();
  });
});
