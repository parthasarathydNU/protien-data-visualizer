// apiUtils.ts
import { AxiosRequestConfig, Method } from 'axios';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

interface RequestConfig {
  method: Method;
  url: string;
  payload?: any;
}

export const apiRequest = async <T>({ method, url, payload }: RequestConfig): Promise<T | undefined> => {
  try {
    const fullUrl = `${API_URL}/${url}`;
    const options = {
      method,
      url: fullUrl,
      data: payload,
    };

    const response = await axios.request<T>(options);
    return response.data;
  } catch (error: any) {
    // window.location.href = '/service-down';
    console.log(error);
  }
};
