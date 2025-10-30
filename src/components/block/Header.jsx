// Application header that adapts placement between desktop and mobile.
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { isMobile } from '../../utils/WindowSize.js';


HeaderContent.propTypes = {
  children: PropTypes.any
};
Header.propTypes = {
  children: PropTypes.any
};

// Render the responsive AppBar container and host nested controls.
function HeaderContent({ children }) {

  return (
    <>
      <AppBar
        position="fixed"
        sx={
          (isMobile())
          ? { top: 'auto', bottom: 0 }
          : { top: 0, bottom: 'auto' }
        }
      >
        <Toolbar>
          {children}
        </Toolbar>
      </AppBar>
    </>
  );
}

// Spacer element ensuring content sits below the AppBar height.
function EnsureHeader() {
  return (
    <>
      {/* Ensure Appbar height  */}
      <Toolbar></Toolbar>
    </>
    );
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
