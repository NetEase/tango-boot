import type { AxiosRequestConfig } from 'axios';
import request from './request';

export function createService(baseConfig: AxiosRequestConfig) {
  return async (payload?: any, config?: AxiosRequestConfig) => {
    const { method = 'get', url, ...restConfig } = config;
    try {
      const resp = await request[method](url, payload, {
        ...restConfig,
        ...baseConfig,
      });
      return resp;
    } catch (err) {
      // TODO: handle error
    }
  };
}

export function createServices(
  configs: Record<string, AxiosRequestConfig>,
  baseConfig: AxiosRequestConfig
): Record<string, ReturnType<typeof createService>> {
  return Object.keys(configs).reduce((acc, key) => {
    acc[key] = createService({ ...configs[key], ...baseConfig });
    return acc;
  }, {});
}
