import type {
  AxiosInstance,
  AxiosResponse,
  CancelTokenSource,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';

interface AxiosRequestConfig extends InternalAxiosRequestConfig {}

interface PendingRequestMap {
  [url: string]: CancelTokenSource;
}

export const addTakeLast = (instance: AxiosInstance) => {
  const pendingRequests: PendingRequestMap = {};

  instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const url = config.url || '';

      if (pendingRequests[url]) {
        if (process.env.NEXT_PUBLIC_APP_STAGE !== 'production') {
          console.log('PREVIOUS PENDING REQUEST CANCEL', url);
        }
        pendingRequests[url].cancel();
      }

      const source = axios.CancelToken.source();
      pendingRequests[url] = source;

      config.cancelToken = source.token;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response) => {
      const url = response.config.url || '';
      delete pendingRequests[url];
      return response;
    },
    (error) => {
      if (axios.isCancel(error)) {
        return Promise.resolve(null);
      }

      return Promise.reject(error);
    },
  );

  instance.request = function request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig,
  ): Promise<R> {
    const url = config.url || '';

    return axios({
      ...config,
      cancelToken: pendingRequests[url]?.token,
    });
  };
};
