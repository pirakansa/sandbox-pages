// Shared theme provider exposing theme mode context and Tailwind dark-mode orchestration.
import './Global.scss';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  THEME_MODE_VALUES,
  THEME_STORAGE_KEY,
  ThemeModeContext
} from './themeModeContext.js';

const DEFAULT_THEME_MODE = 'system';
let inMemoryStoredThemeMode = DEFAULT_THEME_MODE;

function readStoredThemeMode() {
  if (typeof window === 'undefined') {
    return inMemoryStoredThemeMode;
  }
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (THEME_MODE_VALUES.includes(stored)) {
      inMemoryStoredThemeMode = stored;
      return stored;
    }
  } catch (error) {
    console.error('Failed to read theme mode from localStorage.', error);
  }
  inMemoryStoredThemeMode = DEFAULT_THEME_MODE;
  return inMemoryStoredThemeMode;
}

function detectSystemThemeMode() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Provide the shared theme context and synchronize Tailwind's dark class.
 */
function AppThemeProvider({ children }) {
  const [mode, setThemeMode] = useState(() => readStoredThemeMode());
  const [systemMode, setSystemMode] = useState(() => detectSystemThemeMode());

  const resolvedMode = mode === 'system' ? systemMode : mode;

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const root = document.documentElement;
    if (resolvedMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.colorScheme = resolvedMode === 'dark' ? 'dark' : 'light';
  }, [resolvedMode]);

  useEffect(() => {
    inMemoryStoredThemeMode = THEME_MODE_VALUES.includes(mode) ? mode : DEFAULT_THEME_MODE;
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, inMemoryStoredThemeMode);
    } catch (error) {
      console.error('Failed to write theme mode to localStorage.', error);
    }
  }, [mode]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      setSystemMode(event.matches ? 'dark' : 'light');
    };

    handleChange(mediaQuery);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }

    return undefined;
  }, []);

  const setMode = useCallback((nextMode) => {
    if (THEME_MODE_VALUES.includes(nextMode)) {
      setThemeMode(nextMode);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      mode,
      resolvedMode,
      setMode
    }),
    [mode, resolvedMode, setMode]
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      {children}
    </ThemeModeContext.Provider>
  );
}

AppThemeProvider.propTypes = {
  children: PropTypes.node
};

export {
  AppThemeProvider
};
