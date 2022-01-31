import { AnyObject } from '../models/CommonModels';
import { authConfig } from '../config/authConfig';
import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const useApi = (url: string, query?: string, testStartsWith?: string, options?: any) => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState([]);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const controller = new AbortController();

  const cache: AnyObject = useRef({});
  let proceed: boolean = true;
  const cacheKey = `${url}${query}`;

  //BEGIN: TODO: Filtering...remove this
  if (!query && testStartsWith) {
    proceed = false;
  }

  if (
    query &&
    testStartsWith &&
    testStartsWith?.length > 0 &&
    query?.startsWith(testStartsWith) === false
  ) {
    proceed = false;
  }
  //END: TODO: Filtering...remove this

  if (!options) {
    options = { ...authConfig };
  }

  const { audience, scope, ...fetchOptions } = options;

  const callApi = useCallback(
    async (query) => {
      try {
        setLoading(true);

        if (cache.current[cacheKey]) {
          setData(cache.current[cacheKey]);
          setLoading(false);
          setError(null);
        } else {
          const accessToken = await getAccessTokenSilently({ audience, scope });
          let res;

          if (!query) query = '';
          res = await fetch(`${authConfig.audience}${url}${query}`, {
            signal: controller.signal,
            ...fetchOptions,
            headers: {
              ...fetchOptions?.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          });

          cache.current[cacheKey] = await res?.json();
          setData(cache.current[cacheKey]);
          setLoading(false);
          setError(null);
        }
      } catch (error: any) {
        setLoading(false);
        setError(error);
        setData(data);
      }
    },
    [query]
  );

  useEffect(() => {
    if (!url) return;

    setData([]);
    setLoading(false);
    setError(null);

    if (query && query.length === 0) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    proceed && callApi(query);

    return () => controller?.abort();
  }, [query, refreshIndex]);

  return {
    loading,
    error,
    data,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};

export default useApi;
