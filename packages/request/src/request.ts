import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export interface RequestConfig extends AxiosRequestConfig {
  formatter?: (data: any) => any;
}

function createInstance(instanceConfig?: AxiosRequestConfig) {
  // 避免多个实例产生冲突
  const instance = axios.create(instanceConfig);

  // TODO: normalizer
  // TODO: formatter

  // 补齐 origin 上挂载的属性
  Object.keys(origin).forEach((name) => {
    if (!instance[name]) {
      instance[name] = origin[name];
    }
  });

  // request 拦截器
  // instance.interceptors.request.use(
  //   (config) => {
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  // response 拦截器
  instance.interceptors.response.use(
    (response) => {
      let data = response.data;
      const { formatter } = response.config as RequestConfig;
      if (formatter) {
        data = formatter(data);
      }
      return data;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
}

export type RequestType = (url: string, config?: RequestConfig) => Promise<any>;

export default createInstance() as RequestType;
