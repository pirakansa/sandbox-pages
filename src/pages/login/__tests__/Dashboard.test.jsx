import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import Dashboard from '../Dashboard.jsx';

const {
  mockSignInAnonymously,
  mockOnAuthStateChanged,
  mockCreateSessionCookie,
  mockRemoveSessionCookie
} = vi.hoisted(() => ({
  mockSignInAnonymously: vi.fn(),
  mockOnAuthStateChanged: vi.fn(),
  mockCreateSessionCookie: vi.fn(),
  mockRemoveSessionCookie: vi.fn()
}));

let authObserver;

vi.mock('../../../services/firebaseClient.js', () => ({
  auth: {}
}));

vi.mock('../../../services/session.js', () => ({
  createSessionCookie: (...args) => mockCreateSessionCookie(...args),
  removeSessionCookie: (...args) => mockRemoveSessionCookie(...args)
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args) => {
    const unsubscribe = vi.fn();
    mockOnAuthStateChanged(...args);
    if (typeof args[1] === 'function') {
      authObserver = args[1];
    } else {
      authObserver = undefined;
    }
    return unsubscribe;
  },
  signInAnonymously: (...args) => mockSignInAnonymously(...args)
}));

describe('Dashboard login flow', () => {
  beforeEach(() => {
    mockSignInAnonymously.mockReset();
    mockOnAuthStateChanged.mockReset();
    mockCreateSessionCookie.mockReset();
    mockRemoveSessionCookie.mockReset();
    mockSignInAnonymously.mockResolvedValue({});
    authObserver = undefined;
  });

  test('ログインボタンを押すと匿名認証を呼び出す', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    expect(mockOnAuthStateChanged).toHaveBeenCalled();
    act(() => {
      authObserver?.(null);
    });

    expect(mockRemoveSessionCookie).toHaveBeenCalledTimes(1);

    const loginButtons = await screen.findAllByRole('button', { name: '匿名でログイン' });
    const clickableButton = loginButtons.find((button) => !button.disabled) ?? loginButtons[0];
    await user.click(clickableButton);

    expect(mockSignInAnonymously).toHaveBeenCalledTimes(1);
  });

  test('認証済みならセッションCookieを発行してダッシュボード案内を表示する', async () => {
    render(<Dashboard />);

    expect(mockOnAuthStateChanged).toHaveBeenCalled();
    act(() => {
      authObserver?.({ uid: 'test-uid' });
    });

    await screen.findByText('ログインが完了しました。ダッシュボードへ移動します…');
    expect(mockCreateSessionCookie).toHaveBeenCalledTimes(1);
  });

  test('ログイン失敗時にエラーメッセージを表示する', async () => {
    const user = userEvent.setup();
    const error = new Error('intentional error');
    mockSignInAnonymously.mockRejectedValueOnce(error);

    render(<Dashboard />);

    expect(mockOnAuthStateChanged).toHaveBeenCalled();
    act(() => {
      authObserver?.(null);
    });

    const loginButtons = await screen.findAllByRole('button', { name: '匿名でログイン' });
    const clickableButton = loginButtons.find((button) => !button.disabled) ?? loginButtons[0];
    await user.click(clickableButton);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('intentional error');
  });
});
