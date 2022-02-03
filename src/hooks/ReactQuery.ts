import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { QueryKey } from 'react-query/types/core/types';
import { useQuery } from 'react-query';

import { AnyObject } from '../models/CommonModels';
import { authConfig } from '../config/authConfig';
import { useAuth } from '../contexts/AuthContext';

const getAxiosInstance = axios.create({
  baseURL: `/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

function customAxios<T>(url: string, requestOptions: AxiosRequestConfig): Promise<T[]> {
  return getAxiosInstance({
    url: url,
    ...requestOptions,
  })
    .then((response) => response.data)
    .catch((error: AxiosError) => {
      throw error;
    });
}

const useReactQuery = <T>(
  key: QueryKey,
  url: string,
  requestOptions: AxiosRequestConfig,
  reactQueryConfig?: AnyObject
) => {
  const token = useAuth();

  const headers: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...requestOptions.headers,
  };

  return useQuery<T[], Error>(
    key,
    ({ signal }) => {
      return customAxios<T>(url, {
        ...requestOptions,
        ...headers,
        signal,
      });
    },
    { ...reactQueryConfig }
  );
};

export default useReactQuery;
