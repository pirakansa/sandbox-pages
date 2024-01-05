import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import MenuLists from '../block/MenuLists';
import { isMobile } from '../../utils/WindowSize.js';

function MenuBtnContent() {

  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={()=>{setOpen(true)}}
        edge="start"
      >
        <MenuIcon />
      </IconButton>
      
      <Drawer
        anchor={(isMobile()) ? 'bottom' : 'top'}
        open={open}
        onClose={()=>{setOpen(false)}}
      >
        <MenuLists onclick={()=>{setOpen(false)}} />
      </Drawer>
    </>
  );
}

export default function MenuBtn() {
  return <MenuBtnContent />;
}