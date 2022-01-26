// import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import { TextField } from '@mui/material';

const Search = () => {
  return (
    <Container maxWidth={'xl'}>
      <TextField
        autoFocus
        fullWidth
        id="outlined-basic"
        label="Search"
        variant="outlined"
      />
    </Container>
  );
};

export default Search;
