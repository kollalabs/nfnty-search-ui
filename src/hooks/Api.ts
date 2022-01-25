import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

const useApi = (url: string, options: any = {}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState([]);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { audience, scope, ...fetchOptions } = options;
        const accessToken = await getAccessTokenSilently({ audience, scope });
        const res = await fetch(url, {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setLoading(false);
        setError(null);
        setData(await res.json());
      } catch (error: any) {
        setLoading(false);
        setError(error);
        setData(data);
      }
    })();
  }, [refreshIndex]);

  return {
    loading,
    error,
    data,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};

export default useApi;
