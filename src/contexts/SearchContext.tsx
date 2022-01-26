import React, { useState } from 'react';

type SetState = (query: string) => void;
type AppSearchProviderProps = { children: React.ReactNode };

// query is the state
// SearchHandler is a function for changing the state.
export const SearchContext = React.createContext<
  { query: string; queryHandler: SetState } | undefined
>(undefined);

const AppSearchProvider = ({ children }: AppSearchProviderProps) => {
  const [query, queryHandler] = useState('');

  const value = { query, queryHandler };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

const useAppSearch = () => {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchQuery must be used within a SearchProvider');
  }
  return context;
};

export { AppSearchProvider, useAppSearch };
