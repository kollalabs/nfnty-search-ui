import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

const useApi = (url: string, query: string = '', options: any = {}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState([]);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let controller = new AbortController();
    const { audience, scope, ...fetchOptions } = options;

    setData([]);
    setLoading(false);
    setError(null);

    if (query.length === 0) {
      console.log('QUERY:', query);
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const accessToken = await getAccessTokenSilently({ audience, scope });
        let res;

        if (query.startsWith('cl')) {
          res = await fetch(url, {
            signal: controller.signal,
            ...fetchOptions,
            headers: {
              ...fetchOptions?.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setData(await res?.json());
        }

        setLoading(false);
        setError(null);
      } catch (error: any) {
        setLoading(false);
        setError(error);
        setData(data);
      }
    })();

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
