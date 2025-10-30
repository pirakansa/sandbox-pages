// Navigation menu components rendered in the side drawer.
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import HomeIcon from '@mui/icons-material/Home';
import PageviewIcon from '@mui/icons-material/Pageview';
import GrainIcon from '@mui/icons-material/Grain';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LogoutIcon from '@mui/icons-material/Logout';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import PropTypes from 'prop-types';


MenuListsContent.propTypes = {
  onclick: PropTypes.any
};
MenuLists.propTypes = {
  onclick: PropTypes.any
};


// Build the grouped navigation list items shown inside the drawer.
function MenuListsContent({ onclick }) {

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

        <Divider />

        <Link underline='none' href="/login.html">
          <ListItemButton onClick={onclick}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="LOGOUT" />
          </ListItemButton>
        </Link>

      </List>
    </>
  );
}

// Public wrapper component exposing the menu list with click handler.
export default function MenuLists({ onclick }) {
  return <MenuListsContent onclick={onclick} />;
}
