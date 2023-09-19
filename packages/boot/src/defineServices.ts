import { createServices, RequestConfig } from '@music163/request';
import globalTango from './global';

interface IDefineServicesBaseConfig extends RequestConfig {
  namespace?: string;
}

export function defineServices(
  configs: Record<string, RequestConfig>,
  baseConfig?: IDefineServicesBaseConfig,
) {
  const { namespace, ...restConfig } = baseConfig || {};
  const services = createServices(configs, restConfig);
  globalTango.registerServices(services, namespace);
  return services;
}
