import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';

function MenuListsContent() {

  return (
    <>
      <List component="nav" >
        <ListSubheader>
          Content Menus
        </ListSubheader>

        <Link underline='none' href="#/HOME">
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="HOME" />
          </ListItemButton>
        </Link>

        <Divider />

        <Link underline='none' href="/login.html">
          <ListItemButton>
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

export default function MenuLists() {
  return <MenuListsContent />;
}