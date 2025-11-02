import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import MenuLists from '../MenuLists.jsx';

const {
  mockSignOut,
  mockRemoveSessionCookie
} = vi.hoisted(() => ({
  mockSignOut: vi.fn(),
  mockRemoveSessionCookie: vi.fn()
}));

vi.mock('firebase/auth', () => ({
  signOut: (...args) => mockSignOut(...args)
}));

vi.mock('../../../services/firebaseClient.js', () => ({
  auth: {}
}));

vi.mock('../../../services/session.js', () => ({
  removeSessionCookie: (...args) => mockRemoveSessionCookie(...args)
}));

describe('MenuLists logout', () => {
  let replaceSpy;
  const originalLocation = window.location;

  beforeEach(() => {
    mockSignOut.mockReset();
    mockRemoveSessionCookie.mockReset();
    mockSignOut.mockResolvedValue({});
    replaceSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
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
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation
    });
  });

  test('ログアウトボタンでサインアウトとCookie削除を実行する', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<MenuLists onclick={onClick} />);

    const logoutButtons = await screen.findAllByRole('button', { name: 'LOGOUT' });
    await user.click(logoutButtons[0]);

    expect(onClick).toHaveBeenCalled();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockRemoveSessionCookie).toHaveBeenCalledTimes(1);
    expect(replaceSpy).toHaveBeenCalledWith('/login.html');
  });

  test('サインアウト失敗時はリダイレクトしない', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const error = new Error('signout failed');
    mockSignOut.mockRejectedValueOnce(error);

    render(<MenuLists onclick={onClick} />);

    const logoutButtons = await screen.findAllByRole('button', { name: 'LOGOUT' });
    await user.click(logoutButtons[0]);

    expect(mockRemoveSessionCookie).not.toHaveBeenCalled();
    expect(replaceSpy).not.toHaveBeenCalled();
  });
});
