import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import MenuLists from '../block/MenuLists';

function MenuBtnContent() {

  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={()=>{setOpen(true)}}
        edge="start"
      >
        <MenuIcon />
      </IconButton>
      
      <Drawer
        anchor='top'
        open={open}
        onClose={()=>{setOpen(false)}}
      >
        <MenuLists />
      </Drawer>
    </>
  );
}

export default function MenuBtn() {
  return <MenuBtnContent />;
}