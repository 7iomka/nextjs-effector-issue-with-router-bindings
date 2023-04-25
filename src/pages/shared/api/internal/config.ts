import type { AxiosInstance, CreateAxiosDefaults } from 'axios';
import axios from 'axios';
import { createHttp } from 'effector-http-api';
import { createEffect, createStore, sample } from 'effector';
import { addTakeLast } from './lib';

// default axios config
const defaultConfig: Parameters<typeof axios.create>[0] = {
  baseURL: 'http://localhost:3000',
  // withCredentials: true,
};

const $headers = createStore<any>(
  {},
  {
    serialize: 'ignore',
  },
);

interface CreateAxiosInstancePayload {
  config?: CreateAxiosDefaults<any>;
  options?: {
    takeLast?: boolean;
  };
}

const createAxiosInstance = ({ config, options }: CreateAxiosInstancePayload | void = {}) => {
  const instance = axios.create({ ...defaultConfig, ...config });
  if (options?.takeLast) {
    addTakeLast(instance);
  }

  return instance;
};

const setupAxiosFx = createEffect<CreateAxiosInstancePayload | void, AxiosInstance>(
  createAxiosInstance,
);

// Initial value for axios instance
const $axios = createStore<AxiosInstance>(
  createAxiosInstance({ options: { takeLast: typeof window !== 'undefined' } }),
  {
    serialize: 'ignore',
  },
);

const http = createHttp($axios, $headers);

// Replace axios instance on setup updates
sample({
  clock: setupAxiosFx.doneData,
  target: http.updateHttpInstance,
});

export { http, $headers, setupAxiosFx, createAxiosInstance };
