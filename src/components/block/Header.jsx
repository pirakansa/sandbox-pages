// import { useState } from 'react';
import PropTypes from 'prop-types';
// import { ReactElement } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';


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
          {/* <Link href="/index.html">top</Link>
          <Link href="/login.html">login</Link> */}
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