import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { QueryKey } from 'react-query/types/core/types';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from 'react-query';

import { AnyObject } from '../models/CommonModels';
import { authConfig } from '../config/authConfig';

const getAxiosInstance = axios.create({
  baseURL: `${authConfig.audience}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
});


// TODO: Refactor useAuth code to decouple it from this hook
const useApiQuery = <T>(
  key: QueryKey,
  url: string,
  requestOptions: AxiosRequestConfig | null,
  reactQueryConfig?: AnyObject | null
) => {
  const token = useAuth();

  const headers: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...requestOptions?.headers,
  };

  return useQuery<T, Error>(
    key,
    ({ signal }) => {
      return getAxiosInstance({
    url: url,
    ...requestOptions,
  })
    .then((response) => response.data)
    .catch((error: AxiosError) => {
      throw error;
    });

    },
    { ...reactQueryConfig }
  );
};

export default useApiQuery;
