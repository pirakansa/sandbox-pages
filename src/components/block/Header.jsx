import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';


HeaderContent.propTypes = {
  children: PropTypes.any
};
Header.propTypes = {
  children: PropTypes.any
};


function HeaderContent({ children }) {

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {children}
        </Toolbar>
      </AppBar>

      {/* Ensure Appbar height  */}
      <Toolbar></Toolbar>
    </>
  );
}

export default function Header({ children }) {
  return (
    <HeaderContent>
      {children}
    </HeaderContent>
    );
}