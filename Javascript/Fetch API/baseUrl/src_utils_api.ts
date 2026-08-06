import axios, { AxiosRequestConfig } from 'axios';
import { BASE_API_URL } from './constants';

const api = axios.create({
  baseURL: BASE_API_URL,
});

export const apiRequest = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api[method](url, data, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios errors
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`API request failed: ${errorMessage}`);
    } else {
      // Handle other errors
      throw new Error('An unexpected error occurred');
    }
  }
};

