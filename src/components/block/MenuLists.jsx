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

  const navigationLinks = [
    {
      href: '#/home',
      icon: <HomeIcon />,
      label: 'HOME'
    },
    {
      href: '#/ghv',
      icon: <PageviewIcon />,
      label: 'Github Viwer'
    },
    {
      href: '#/version',
      icon: <InfoIcon />,
      label: 'Version'
    },
    {
      href: '#/fgv',
      icon: <GrainIcon />,
      label: 'ForceGraph Viwer'
    },
    {
      href: '#/camv',
      icon: <QrCodeIcon />,
      label: 'Camera Viwer'
    },
    {
      href: '#/wasm',
      icon: <ScienceIcon />,
      label: 'WASM Lab'
    }
  ];

  return (
    <>
      <List component="nav" >
        <ListSubheader>
          Content Menus
        </ListSubheader>

        {navigationLinks.map(({ href, icon, label }) => (
          <ListItemButton
            key={href}
            component={Link}
            href={href}
            underline="none"
            onClick={onclick}
            sx={{ width: '100%', color: 'inherit', textDecoration: 'none' }}
          >
            <ListItemIcon>
              {icon}
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}

        <Divider />

        <ListItemButton
          onClick={handleLogout}
          sx={{ width: '100%' }}
        >
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
