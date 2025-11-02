import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import SessionStatus from '../SessionStatus.jsx';
import { AppThemeProvider } from '../../../utils/Theme.jsx';

const { mockAuth, mockOnAuthStateChanged } = vi.hoisted(() => ({
  mockAuth: { currentUser: null },
  mockOnAuthStateChanged: vi.fn()
}));

let authObserver;

function renderWithTheme(ui) {
  return render(<AppThemeProvider>{ui}</AppThemeProvider>);
}

afterEach(() => {
  cleanup();
});

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args) => {
    mockOnAuthStateChanged(...args);
    authObserver = typeof args[1] === 'function' ? args[1] : undefined;
    return vi.fn();
  }
}));

vi.mock('../../../services/firebaseClient.js', () => ({
  auth: mockAuth
}));

describe('SessionStatus', () => {
  beforeEach(() => {
    mockAuth.currentUser = null;
    mockOnAuthStateChanged.mockClear();
    authObserver = undefined;
    window.localStorage.clear();
  });

  it('認証済みUIDを表示する', async () => {
    const uid = 'user-12345';
    mockAuth.currentUser = { uid };

    renderWithTheme(<SessionStatus />);

    await act(async () => {
      authObserver?.({ uid });
    });

    expect(await screen.findByText(uid)).toBeInTheDocument();
  });

  it('認証済みユーザーがいなければメッセージを表示する', async () => {
    renderWithTheme(<SessionStatus />);

    await act(async () => {
      authObserver?.(null);
    });

    expect(
      await screen.findByText('認証済みユーザーは確認できませんでした。')
    ).toBeInTheDocument();
  });

  it('リフレッシュ操作で最新のUIDを再取得する', async () => {
    renderWithTheme(<SessionStatus />);

    await act(async () => {
      authObserver?.(null);
    });

    mockAuth.currentUser = { uid: 'refreshed-user' };

    fireEvent.click(screen.getByRole('button', { name: '最新状態を再取得' }));

    expect(await screen.findByText('refreshed-user')).toBeInTheDocument();
  });
});
