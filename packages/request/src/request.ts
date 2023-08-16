import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export interface RequestConfig extends AxiosRequestConfig {
  formatter?: (data: any) => any;
}

function createInstance(instanceConfig?: AxiosRequestConfig) {
  // 避免多个实例产生冲突
  const instance = axios.create(instanceConfig);

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
    },
  );

  return instance;
}

export interface RequestInstance {
  (config: RequestConfig): Promise<any>;
  (url: string, config?: RequestConfig): Promise<any>;

  get: (url: string, params?: Record<string, any>, config?: RequestConfig) => Promise<any>;

  post: (url: string, data?: any, config?: RequestConfig) => Promise<any>;

  put: (url: string, data?: any, config?: RequestConfig) => Promise<any>;
}

const request = createInstance() as RequestInstance;

request.get = (url: string, params?: Record<string, any>, config?: RequestConfig) => {
  return request({ url, params, ...config });
};

export default request;
