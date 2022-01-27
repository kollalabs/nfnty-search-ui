// import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import { TextField } from '@mui/material';
import { useAppSearch } from '../../contexts/SearchContext';

const Search = () => {
  const { query, queryHandler } = useAppSearch();

  return (
    <Container maxWidth={'xl'}>
      <TextField
        autoFocus
        fullWidth
        id="outlined-basic"
        label="Search"
        variant={'filled'}
        onChange={(e) => queryHandler(e?.target?.value)}
        value={query}
      />
    </Container>
  );
};

export default Search;
