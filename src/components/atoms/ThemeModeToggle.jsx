// Theme mode toggle button group shared across surfaces.
import PropTypes from 'prop-types';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from '../../utils/themeModeContext.js';

/**
 * Render the three-state theme mode switcher (light / system / dark).
 */
function ThemeModeToggle({ size = 'medium', sx }) {
  const theme = useTheme();
  const { mode, setMode } = useThemeMode();

  return (
    <ToggleButtonGroup
      size={size}
      value={mode}
      exclusive
      onChange={(_, nextMode) => {
        if (nextMode) {
          setMode(nextMode);
        }
      }}
      aria-label="テーマモード切り替え"
      sx={{
        backgroundColor: theme.palette.action.hover,
        borderRadius: 999,
        '& .MuiToggleButton-root': {
          border: 0,
          px: 1.25,
          py: 0.5,
          transition: theme.transitions.create(['background-color', 'color'], {
            duration: theme.transitions.duration.short
          }),
          '&.Mui-selected': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.primary.main,
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 8px 24px rgba(2, 6, 23, 0.35)'
                : '0 8px 24px rgba(15, 23, 42, 0.15)'
          }
        },
        ...sx
      }}
    >
      <ToggleButton value="light" aria-label="ライトモード" title="ライトモード">
        <LightModeIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton
        value="system"
        aria-label="システム設定に合わせる"
        title="システム設定に合わせる"
      >
        <SettingsBrightnessIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton value="dark" aria-label="ダークモード" title="ダークモード">
        <DarkModeIcon fontSize="small" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

ThemeModeToggle.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  sx: PropTypes.object
};

export default ThemeModeToggle;
