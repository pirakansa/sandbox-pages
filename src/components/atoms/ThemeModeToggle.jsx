// Theme mode toggle button group shared across surfaces.
import PropTypes from 'prop-types';
import { useThemeMode } from '../../utils/themeModeContext.js';

const SIZE_STYLES = {
  small: {
    button: 'h-8 w-8 text-xs',
    icon: 'h-4 w-4'
  },
  medium: {
    button: 'h-10 w-10 text-sm',
    icon: 'h-5 w-5'
  },
  large: {
    button: 'h-12 w-12 text-base',
    icon: 'h-6 w-6'
  }
};

function LightModeIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      <path
        d="M12 3v2M12 19v2M5 12h2M17 12h2M6.22 6.22l1.42 1.42M16.36 16.36l1.42 1.42M6.22 17.78l1.42-1.42M16.36 7.64l1.42-1.42"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

LightModeIcon.propTypes = {
  className: PropTypes.string
};

function SystemModeIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="7"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      <path
        d="M12 5a7 7 0 0 1 0 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M15 12a3 3 0 1 1-3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

SystemModeIcon.propTypes = {
  className: PropTypes.string
};

function DarkModeIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M21 12.89A9 9 0 1 1 11.11 3a7.5 7.5 0 0 0 9.89 9.89Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

DarkModeIcon.propTypes = {
  className: PropTypes.string
};

/**
 * Render the three-state theme mode switcher (light / system / dark).
 */
function ThemeModeToggle({ size = 'medium', sx }) {
  const { mode, setMode } = useThemeMode();
  const sizeStyle = SIZE_STYLES[size] ?? SIZE_STYLES.medium;
  const buttons = [
    {
      value: 'light',
      label: 'ライトモード',
      icon: LightModeIcon
    },
    {
      value: 'system',
      label: 'システム設定に合わせる',
      icon: SystemModeIcon
    },
    {
      value: 'dark',
      label: 'ダークモード',
      icon: DarkModeIcon
    }
  ];

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full bg-slate-200/70 p-1 text-slate-600 shadow-inner backdrop-blur dark:bg-slate-800/70 dark:text-slate-200"
      style={sx}
      aria-label="テーマモード切り替え"
    >
      {buttons.map(({ value, label, icon: IconComponent }) => {
        const selected = mode === value;
        return (
          <button
            key={value}
            type="button"
            className={`inline-flex items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${sizeStyle.button} ${
              selected
                ? 'bg-white text-blue-600 shadow-md dark:bg-slate-700 dark:text-blue-300'
                : 'text-slate-500 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-700/70'
            }`}
            aria-pressed={selected}
            aria-label={label}
            title={label}
            onClick={() => {
              if (value !== mode) {
                setMode(value);
              }
            }}
          >
            <IconComponent className={sizeStyle.icon} />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

ThemeModeToggle.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  sx: PropTypes.object
};

export default ThemeModeToggle;
