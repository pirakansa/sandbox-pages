// Shared theme provider and mode context for consistent styling across views.
import './Global.scss';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import {
  THEME_MODE_VALUES,
  THEME_STORAGE_KEY,
  ThemeModeContext
} from './themeModeContext.js';

function readStoredThemeMode() {
  if (typeof window === 'undefined') {
    return 'system';
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return THEME_MODE_VALUES.includes(stored) ? stored : 'system';
}

function detectSystemThemeMode() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Create the Material UI theme tailored for this project.
 */
function createAppTheme(mode = 'light') {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#90caf9' : '#1f6feb'
      },
      background: {
        default: mode === 'dark' ? '#0d1117' : '#f4f6fb',
        paper: mode === 'dark' ? '#161b22' : '#ffffff'
      },
      text: {
        primary: mode === 'dark' ? '#f0f6fc' : '#0d1117',
        secondary:
          mode === 'dark' ? 'rgba(240, 246, 252, 0.65)' : 'rgba(15, 23, 42, 0.65)'
      }
    },
    shape: {
      borderRadius: 12
    },
    typography: {
      fontFamily: `'Roboto','Noto Sans JP','Helvetica','Arial',sans-serif`,
      button: {
        textTransform: 'none',
        fontWeight: 600
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor:
              mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(15, 23, 42, 0.08)',
            boxShadow:
              mode === 'dark'
                ? '0 20px 45px rgba(15, 23, 42, 0.18)'
                : '0 20px 45px rgba(15, 23, 42, 0.12)'
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderBottom: mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(15, 23, 42, 0.08)',
            backgroundImage: 'none',
            backdropFilter: 'blur(12px)'
          }
        }
      }
    }
  });
}

/**
 * Provide the shared theme and expose hook-based mode controls.
 */
function AppThemeProvider({ children }) {
  const [mode, setThemeMode] = useState(() => readStoredThemeMode());
  const [systemMode, setSystemMode] = useState(() => detectSystemThemeMode());

  const resolvedMode = mode === 'system' ? systemMode : mode;
  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
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
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}

AppThemeProvider.propTypes = {
  children: PropTypes.node
};

export {
  AppThemeProvider
};
