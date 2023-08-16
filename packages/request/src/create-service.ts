import request, { RequestConfig } from './request';

export function createService(baseConfig: RequestConfig) {
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
      const resp = await request[method](url, payload, restConfig);
      return resp;
    } catch (err) {
      // TODO: handle error
    }
  };
}

export function createServices(
  configs: Record<string, RequestConfig>,
  baseConfig?: RequestConfig
): Record<string, ReturnType<typeof createService>> {
  return Object.keys(configs).reduce((acc, key) => {
    acc[key] = createService({ ...configs[key], ...baseConfig });
    return acc;
  }, {});
}
