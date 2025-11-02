import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import Dashboard from '../Dashboard.jsx';

const {
  mockSendSignInLinkToEmail,
  mockSignInWithEmailLink,
  mockIsSignInWithEmailLink,
  mockSignInAnonymously,
  mockOnAuthStateChanged,
  mockCreateSessionCookie,
  mockRemoveSessionCookie
} = vi.hoisted(() => ({
  mockSendSignInLinkToEmail: vi.fn(),
  mockSignInWithEmailLink: vi.fn(),
  mockIsSignInWithEmailLink: vi.fn(),
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
  sendSignInLinkToEmail: (...args) => mockSendSignInLinkToEmail(...args),
  signInWithEmailLink: (...args) => mockSignInWithEmailLink(...args),
  isSignInWithEmailLink: (...args) => mockIsSignInWithEmailLink(...args),
  signInAnonymously: (...args) => mockSignInAnonymously(...args)
}));

describe('Dashboard login flow', () => {
  beforeEach(() => {
    mockSendSignInLinkToEmail.mockReset();
    mockSignInWithEmailLink.mockReset();
    mockIsSignInWithEmailLink.mockReset();
    mockSignInAnonymously.mockReset();
    mockOnAuthStateChanged.mockReset();
    mockCreateSessionCookie.mockReset();
    mockRemoveSessionCookie.mockReset();
    mockSendSignInLinkToEmail.mockResolvedValue(undefined);
    mockSignInWithEmailLink.mockResolvedValue(undefined);
    mockIsSignInWithEmailLink.mockReturnValue(false);
    mockSignInAnonymously.mockResolvedValue({});
    authObserver = undefined;
    window.localStorage.clear();
  });

  test('ゲストパスをクリックすると匿名認証を呼び出す', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    expect(mockOnAuthStateChanged).toHaveBeenCalled();
    act(() => {
      authObserver?.(null);
    });

    expect(mockRemoveSessionCookie).toHaveBeenCalledTimes(1);

    const buttons = await screen.findAllByRole('button', { name: 'ゲストパスで入室' });
    const clickableButton = buttons.find((button) => !button.disabled) ?? buttons[0];
    await user.click(clickableButton);

    expect(mockSignInAnonymously).toHaveBeenCalledTimes(1);
  });

  test('メールアドレスを入力するとログインリンク送信を呼び出す', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    expect(mockOnAuthStateChanged).toHaveBeenCalled();
    act(() => {
      authObserver?.(null);
    });

    expect(mockRemoveSessionCookie).toHaveBeenCalledTimes(1);

    const emailField = await screen.findByLabelText(/メールアドレス/);
    await user.type(emailField, 'user@example.com');

    const loginButton = await screen.findByRole('button', { name: 'ログインリンクを送信' });
    await user.click(loginButton);

    expect(mockSendSignInLinkToEmail).toHaveBeenCalledTimes(1);
    expect(mockSendSignInLinkToEmail.mock.calls[0][0]).toBeDefined();
    expect(mockSendSignInLinkToEmail.mock.calls[0][1]).toBe('user@example.com');
    expect(mockSendSignInLinkToEmail.mock.calls[0][2]).toMatchObject({
      handleCodeInApp: true,
      url: `${window.location.origin}/login.html`
    });
  });

  test('保存済みメールがあればメールリンクで自動ログインする', async () => {
    window.localStorage.setItem('loginEmailAddress', 'saved@example.com');
    mockIsSignInWithEmailLink.mockReturnValue(true);

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockSignInWithEmailLink).toHaveBeenCalledTimes(1);
    });

    expect(mockSignInWithEmailLink.mock.calls[0][0]).toBeDefined();
    expect(mockSignInWithEmailLink.mock.calls[0][1]).toBe('saved@example.com');
    expect(mockSignInWithEmailLink.mock.calls[0][2]).toBe(window.location.href);

    const uid = 'test-uid';
    act(() => {
      authObserver?.({ uid });
    });

    await screen.findByText('ログインが完了しました。ダッシュボードへ移動します…');
    expect(mockCreateSessionCookie).toHaveBeenCalledTimes(1);
    expect(mockCreateSessionCookie).toHaveBeenCalledWith(uid);
  });

  test('保存済みメールがない場合にリンク完了用メール入力を促す', async () => {
    mockIsSignInWithEmailLink.mockReturnValue(true);

    const user = userEvent.setup();
    render(<Dashboard />);

    act(() => {
      authObserver?.(null);
    });

    await waitFor(() => {
      expect(mockIsSignInWithEmailLink).toHaveBeenCalled();
    });

    const emailField = await screen.findByLabelText(/メールアドレス/);
    await user.type(emailField, 'user@example.com');

    const completeButton = await screen.findByRole('button', { name: 'ログインを完了' });
    await user.click(completeButton);

    expect(mockSignInWithEmailLink).toHaveBeenCalledTimes(1);
    expect(mockSignInWithEmailLink.mock.calls[0][0]).toBeDefined();
    expect(mockSignInWithEmailLink.mock.calls[0][1]).toBe('user@example.com');
    expect(mockSignInWithEmailLink.mock.calls[0][2]).toBe(window.location.href);
  });

  test('ログインリンク送信に失敗するとエラーメッセージを表示する', async () => {
    const user = userEvent.setup();
    const error = new Error('intentional error');
    mockSendSignInLinkToEmail.mockRejectedValueOnce(error);

    render(<Dashboard />);

    expect(mockOnAuthStateChanged).toHaveBeenCalled();
    act(() => {
      authObserver?.(null);
    });

    const emailField = await screen.findByLabelText(/メールアドレス/);
    await user.type(emailField, 'user@example.com');

    const loginButton = await screen.findByRole('button', { name: 'ログインリンクを送信' });
    await user.click(loginButton);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('intentional error');
  });

  test('メールリンク完了で失敗した場合にエラーメッセージを表示する', async () => {
    window.localStorage.setItem('loginEmailAddress', 'saved@example.com');
    mockIsSignInWithEmailLink.mockReturnValue(true);
    const linkError = new Error('link error');
    mockSignInWithEmailLink.mockRejectedValueOnce(linkError);

    render(<Dashboard />);

    await waitFor(() => {
      expect(mockIsSignInWithEmailLink).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockSignInWithEmailLink).toHaveBeenCalledTimes(1);
    });

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('link error');
  });
});
