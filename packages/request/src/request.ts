import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

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
  return instance;
}

export default createInstance();
