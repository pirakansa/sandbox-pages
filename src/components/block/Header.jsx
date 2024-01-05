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

function EnsureHeader() {
  return (
    <>
      {/* Ensure Appbar height  */}
      <Toolbar></Toolbar>
    </>
    );
}

function Header({ children }) {
  return (
    <HeaderContent>
      {children}
    </HeaderContent>
    );
}

export { Header, EnsureHeader };
