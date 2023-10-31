import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { mergeObjects } from './helpers';

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

export interface RequestInstance extends AxiosInstance {
  get: (url: string, params?: object, config?: RequestConfig) => Promise<any>;
  postFormData: (url: string, data?: object, config?: RequestConfig) => Promise<any>;
  postFormUrlencoded: (url: string, data?: object, config?: RequestConfig) => Promise<any>;
}

function createInstance(instanceConfig?: AxiosRequestConfig) {
  // 避免多个实例产生冲突
  const instance = axios.create(instanceConfig) as RequestInstance;

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

      /**
       * data 格式
       * {
       *   code: 200, // 必选，业务状态码
       *   message: 'success', // 必选，业务状态描述
       *   data: {} | [], // 必选，业务数据
       * }
       */
      const { code = 200, message } = data;

      if (code !== 200) {
        throw new Error(`${code}: ${message || 'request failed!'}, ${response.config.url}`);
      }

      if (!('data' in data)) {
        console.warn('response data should have a data field', response.config.url);
      }

      return data.data;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // 扩展 get 方法
  instance.get = (url: string, params?: Record<string, any>, config?: RequestConfig) => {
    return instance.request({ url, params, ...config });
  };

  // 扩展 post 方法
  instance.postFormData = (url: string, data?: object, config?: RequestConfig) => {
    return instance.post(
      url,
      data,
      mergeObjects(config, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    );
  };

  // 扩展 post 方法
  instance.postFormUrlencoded = (url: string, data?: object, config?: RequestConfig) => {
    return instance.post(
      url,
      data,
      mergeObjects(config, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }),
    );
  };

  return instance;
}

export default createInstance();
