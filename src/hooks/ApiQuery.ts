import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { AccessToken } from '../models/AuthModels';
import { QueryKey } from 'react-query/types/core/types';
import { authConfig } from '../config/authConfig';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useQuery } from 'react-query';

import { AnyObject } from '../models/CommonModels';

const axiosInstance = axios.create({
  baseURL: `${authConfig.audience}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const useApiQuery = <T>(
  key: QueryKey,
  url: string,
  requestOptions: AxiosRequestConfig | null,
  reactQueryConfig?: AnyObject | null
) => {
  const token: AccessToken = useAuth();

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, [token]);

  const headers: AxiosRequestConfig = {
    ...requestOptions?.headers,
  };

  return useQuery<T, Error>(
    key,
    ({ signal }) => {
      return axiosInstance({
        url: url,
        ...headers,
        ...signal,
      })
        .then((response) => response.data)
        .catch((error: AxiosError) => {
          console.log('Error inside useQuery:', error);
          throw error;
        });
    },
    { ...reactQueryConfig }
  );
};

export { useApiQuery as default };
