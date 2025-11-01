// Search text input with submit button used across dashboard views.
import PropTypes from 'prop-types';
import { useRef } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

SearchTextContent.propTypes = {
  onsubmit: PropTypes.any,
  placeholder: PropTypes.any
};
SearchText.propTypes = {
  onsubmit: PropTypes.any,
  placeholder: PropTypes.any
};


// Render the controlled search form and forward submissions.
function SearchTextContent({ onsubmit, placeholder }) {

  const ref = useRef();

  const onSubmitHandler = () => {
    onsubmit(ref.current.value);
  }

  return (
    <Paper
      component="form"
      sx={{ display: 'flex' }}
      onSubmit={(ev)=>{
        ev.preventDefault();
        onSubmitHandler();
      }}
    >

      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        inputRef={ref}
      />

      <IconButton
        onClick={()=>onSubmitHandler()}
        type="button"
        sx={{ p: '0.5em' }}
      >
        <SearchIcon />
      </IconButton>
    
    </Paper>
  );
}

// Wrapper atom that wires validation and props through to the actual form.
export default function SearchText({ onsubmit, placeholder }) {
  return <SearchTextContent onsubmit={onsubmit} placeholder={placeholder} />;
}
