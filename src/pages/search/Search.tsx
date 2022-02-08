import CheckError from '../../components/common/ErrorCheck';
import React from 'react';

import NoResults from '../../components/search/NoResults';
import PreSearch from '../../components/search/PreSearch';
import SearchBar from '../../components/search/SearchBar';
import SearchSkeleton from '../../components/skeletons/SearchSkeleton';
import useApiQuery from '../../hooks/ApiQuery';
import useAuthCheck from '../../hooks/AuthCheck';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { Connection } from '../../models/DataModels';
import { SearchItems } from './SearchItems';
import { useAppSearch } from '../../contexts/SearchContext';
import { useDebounce } from '../../hooks/Utilities';

const Search = () => {
  let results: string[] = [];

  useDocumentTitle('Search all the things');
  useAuthCheck();
  const { query } = useAppSearch();
  const debouncedValue = useDebounce<string>(query, 200);

  const searchQuery = useApiQuery<Connection>(
    ['search', debouncedValue],
    `search?filter=${debouncedValue}`,
    {
      method: 'GET',
    },
    {
      enabled: Boolean(debouncedValue.length > 0),
    }
  );

  if (searchQuery.data) {
    results = Object.keys(searchQuery.data);
  }

  return (
    <>
      <SearchBar />
      {!searchQuery.data && searchQuery.isFetching && <SearchSkeleton />}
      {searchQuery.error instanceof Error && (
        <CheckError error={searchQuery.error} apiRefresh={searchQuery.refetch} />
      )}
      {!searchQuery.isFetching && !searchQuery.error && query.length === 0 && (
        <PreSearch message={'Hey, start searching!'} />
      )}
      {results.length > 0 && SearchItems(results, searchQuery.data)}
      {(!searchQuery.isFetching || !searchQuery.isLoading) &&
        searchQuery.isSuccess &&
        searchQuery.data &&
        query.length > 0 &&
        results.length === 0 && <NoResults />}
    </>
  );
};

export default Search;
