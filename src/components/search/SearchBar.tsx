// import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import { TextField } from '@mui/material';
import { useAppSearch } from '../../contexts/SearchContext';
import { useKeyPress } from '../../hooks/Utility';

const SearchBar = () => {
  const { query, queryHandler } = useAppSearch();
  useKeyPress(['Escape'], () => queryHandler(''));

  return (
    <Container maxWidth={'xl'} sx={{ pb: 2 }} disableGutters>
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

export default SearchBar;
