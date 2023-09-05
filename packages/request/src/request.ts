import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export interface RequestConfig extends AxiosRequestConfig {
  /**
   * 响应格式化函数
   * @param data 响应数据
   * @returns 返回格式化后的数据
   */
  formatter?: (data: any) => any;
  /**
   * 路径变量，例如 `/users/:id`，其中 id 为路径变量
   */
  pathVariables?: Record<string, any>;
}

function createInstance(instanceConfig?: AxiosRequestConfig) {
  // 避免多个实例产生冲突
  const instance = axios.create(instanceConfig);

  // request 拦截器
  instance.interceptors.request.use(
    (config) => {
      const { pathVariables } = config as RequestConfig;
      if (pathVariables) {
        config.url = config.url.replace(/\/:(\w+)/gi, (_, key) => `/${pathVariables[key]}`);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

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
