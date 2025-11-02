// Navigation menu components rendered in the side drawer.
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import HomeIcon from '@mui/icons-material/Home';
import PageviewIcon from '@mui/icons-material/Pageview';
import GrainIcon from '@mui/icons-material/Grain';
import QrCodeIcon from '@mui/icons-material/QrCode';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import ScienceIcon from '@mui/icons-material/Science';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import PropTypes from 'prop-types';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebaseClient.js';
import { removeSessionCookie } from '../../services/session.js';


MenuListsContent.propTypes = {
  onclick: PropTypes.any
};
MenuLists.propTypes = {
  onclick: PropTypes.any
};


// Build the grouped navigation list items shown inside the drawer.
function MenuListsContent({ onclick }) {

  const handleLogout = async () => {
    if (typeof onclick === 'function') {
      onclick();
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error('ログアウトに失敗しました', error);
      return;
    }

    removeSessionCookie();

    if (typeof window !== 'undefined' && window.location?.replace) {
      window.location.replace('/login.html');
    }
  };

  return (
    <>
      <List component="nav" >
        <ListSubheader>
          Content Menus
        </ListSubheader>

        <Link underline='none' href="#/home">
          <ListItemButton onClick={onclick}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="HOME" />
          </ListItemButton>
        </Link>

        <Link underline='none' href="#/ghv">
          <ListItemButton onClick={onclick}>
            <ListItemIcon>
              <PageviewIcon />
            </ListItemIcon>
            <ListItemText primary="Github Viwer" />
          </ListItemButton>
        </Link>

        <Link underline='none' href="#/version">
          <ListItemButton onClick={onclick}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="Version" />
          </ListItemButton>
        </Link>

        <Link underline='none' href="#/fgv">
          <ListItemButton onClick={onclick}>
            <ListItemIcon>
              <GrainIcon />
            </ListItemIcon>
            <ListItemText primary="ForceGraph Viwer" />
          </ListItemButton>
        </Link>

        <Link underline='none' href="#/camv">
          <ListItemButton onClick={onclick}>
            <ListItemIcon>
              <QrCodeIcon />
            </ListItemIcon>
            <ListItemText primary="Camera Viwer" />
          </ListItemButton>
        </Link>

        <Link underline='none' href="#/wasm">
          <ListItemButton onClick={onclick}>
            <ListItemIcon>
              <ScienceIcon />
            </ListItemIcon>
            <ListItemText primary="WASM Lab" />
          </ListItemButton>
        </Link>

        <Divider />

        <ListItemButton component="button" onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="LOGOUT" />
        </ListItemButton>

      </List>
    </>
  );
}

// Public wrapper component exposing the menu list with click handler.
export default function MenuLists({ onclick }) {
  return <MenuListsContent onclick={onclick} />;
}
