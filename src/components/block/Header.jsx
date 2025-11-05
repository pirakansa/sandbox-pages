// Application header that adapts placement between desktop and mobile.
import PropTypes from 'prop-types';
import { isMobile } from '../../utils/WindowSize.js';
import ThemeModeToggle from '../atoms/ThemeModeToggle.jsx';

const DESKTOP_HEIGHT_CLASS = 'h-16';
const MOBILE_HEIGHT_CLASS = 'h-14';

HeaderContent.propTypes = {
  children: PropTypes.any
};

Header.propTypes = {
  children: PropTypes.any
};

// Render the responsive AppBar container and host nested controls.
function HeaderContent({ children }) {
  const mobile = isMobile();
  const positionClass = mobile ? 'bottom-0 border-t border-slate-200 dark:border-slate-800' : 'top-0 border-b border-slate-200 dark:border-slate-800';
  const paddingClass = mobile ? 'px-4 py-2' : 'px-6 py-3';
  const heightClass = mobile ? MOBILE_HEIGHT_CLASS : DESKTOP_HEIGHT_CLASS;

  return (
    <header
      className={`fixed left-0 right-0 z-[1200] bg-white/85 backdrop-blur-lg shadow-sm dark:bg-slate-900/85 ${positionClass}`}
      style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}
    >
      <div className={`mx-auto flex ${heightClass} max-w-6xl items-center justify-between gap-4 ${paddingClass}`}>
        <div className="flex items-center gap-4 text-slate-800 dark:text-slate-100">
          {children}
        </div>
        <ThemeModeToggle size="small" />
      </div>
    </header>
  );
}

// Spacer element ensuring content sits below the AppBar height.
function EnsureHeader() {
  const mobile = isMobile();
  const heightClass = mobile ? MOBILE_HEIGHT_CLASS : DESKTOP_HEIGHT_CLASS;
  return <div className={heightClass} aria-hidden="true" />;
}

// Exported header component that forwards children to the content shell.
function Header({ children }) {
  return (
    <HeaderContent>
      {children}
    </HeaderContent>
  );
}

export { Header, EnsureHeader };
