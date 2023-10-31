import request, { RequestConfig } from './request';
import globalConfig from './global-config';

export interface CreateServiceConfig extends RequestConfig {
  onSuccess?: (data: any) => any;
  onError?: (error: any) => any;
}

export function createService({ onSuccess, onError, ...baseConfig }: CreateServiceConfig) {
  return async (payload?: any, config?: RequestConfig) => {
    const {
      method = 'get',
      url,
      ...restConfig
    } = {
      ...config,
      ...baseConfig,
    };
    try {
      const data = await request[method](url, payload, restConfig);
      onSuccess?.(data);
      return data;
    } catch (err) {
      globalConfig.message?.error((err as any).message);
      onError?.(err);
    }
  };
}

export function createServices(
  configs: Record<string, RequestConfig>,
  baseConfig?: RequestConfig,
): Record<string, ReturnType<typeof createService>> {
  return Object.keys(configs).reduce((acc, key) => {
    acc[key] = createService({ ...configs[key], ...baseConfig });
    return acc;
  }, {});
}
