// Theme mode context and helpers shared across components.
import { createContext, useContext } from 'react';

const THEME_STORAGE_KEY = 'app/theme-mode';
const THEME_MODE_VALUES = ['light', 'dark', 'system'];

const ThemeModeContext = createContext({
  mode: 'system',
  resolvedMode: 'light',
  setMode: () => {}
});

function useThemeMode() {
  return useContext(ThemeModeContext);
}

export {
  THEME_MODE_VALUES,
  THEME_STORAGE_KEY,
  ThemeModeContext,
  useThemeMode
};
