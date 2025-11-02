import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { AppThemeProvider } from '../Theme.jsx';
import { useThemeMode } from '../themeModeContext.js';

function ModeReader() {
  const { mode } = useThemeMode();
  return <span data-testid="mode-value">{mode}</span>;
}

function ModeSwitcher() {
  const { resolvedMode, setMode } = useThemeMode();
  return (
    <>
      <span data-testid="resolved-mode">{resolvedMode}</span>
      <button type="button" onClick={() => setMode('dark')}>
        set-dark
      </button>
    </>
  );
}

describe('AppThemeProvider storage resilience', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    window.localStorage.clear();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  test('ローカルストレージ読み込み失敗時にフォールバックする', () => {
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('storage disabled');
    });

    render(
      <AppThemeProvider>
        <ModeReader />
      </AppThemeProvider>
    );

    expect(screen.getByTestId('mode-value')).toHaveTextContent('system');
  });

  test('ローカルストレージ書き込み失敗時でもモード更新が継続される', async () => {
    const user = userEvent.setup();
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('storage disabled');
    });

    render(
      <AppThemeProvider>
        <ModeSwitcher />
      </AppThemeProvider>
    );

    expect(screen.getByTestId('resolved-mode')).toHaveTextContent('light');

    await user.click(screen.getByRole('button', { name: 'set-dark' }));

    expect(screen.getByTestId('resolved-mode')).toHaveTextContent('dark');
  });
});
