import CheckError from '../../components/common/ErrorCheck';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

import SearchBar from '../../components/search/SearchBar';
import useApi from '../../hooks/Api';
import useAuthCheck from '../../hooks/AuthCheck';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { NoData, PreSearch } from '../../components/search/NoData';
import { SearchItems } from './SearchItems';
import { useAppSearch } from '../../contexts/SearchContext';
import { useDebounce } from '../../hooks/Utilities';

const Search = () => {
  let companies: string[] = [];

  useDocumentTitle('App Search');
  useAuthCheck();
  const { query } = useAppSearch();
  const debouncedValue = useDebounce<string>(query, 200);
  const { loading, error, data, refresh } = useApi(`/api/search?text=`, debouncedValue);

  if (data) {
    // companies...
    companies = Object.keys(data);
  }

  return (
    <>
      <SearchBar />
      {loading && <CircularProgress />}
      {error && <CheckError error={error} apiRefresh={refresh} />}
      {!loading && !error && query.length === 0 && <PreSearch />}
      {companies.length > 0 && SearchItems(companies, data)}
      {!loading && query.length > 0 && companies.length === 0 && <NoData />}
    </>
  );
};

export default Search;
