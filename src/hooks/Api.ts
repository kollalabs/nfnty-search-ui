import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

const useApi = (url: string, query: string = '', options: any = {}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState([]);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let controller = new AbortController();
    const { audience, scope, ...fetchOptions } = options;

    if (query.length === 0) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    (async () => {
      try {
        const accessToken = await getAccessTokenSilently({ audience, scope });
        let res;

        if (import.meta.env.PROD) {
          res = await fetch(url, {
            signal: controller.signal,
            ...fetchOptions,
            headers: {
              ...fetchOptions?.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setData(await res?.json());
        } else {
          setData(
            JSON.parse(
              '{"jobnimbus":{"meta":{"logo":"https://api.jobnimbus.kolla.dev/assets/img/logo-main.png","display_name":"JobNimbus"},"results":[{"title":"Contact - Clint Berry","description":"Clint Berry is a contact in JobNimbus","link":"https://app.jobnimbus.com/contact/kwqtnapghyhm2cmsdvu5l51","kvdata":{"Phone":"8015551234"}},{"title":"Task - Lead Aging Warning","description":"Lead aging warning for Clinton Sanzota","link":"https://app.jobnimbus.com/task/kyqf1n6vc8su2wuukyfk0jy","kvdata":{"Priority":"HIGH"}}]}}'
            )
          );
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
  }, [refreshIndex, query]);

  return {
    loading,
    error,
    data,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};

export { useApi };
