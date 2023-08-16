import { createServices, RequestConfig } from '@music163/request';
import globalTango from './global';

export function defineServices(
  configs: Record<string, RequestConfig>,
  baseConfig?: RequestConfig
) {
  const services = createServices(configs, baseConfig);
  globalTango.registerServices(services);
  return services;
}
