import { getValue, setValue } from '@music163/tango-helpers';
import { store } from '@risingstack/react-easy-state';

type StoreType = ReturnType<typeof store>;

const globalTango = {
  config: {},
  services: {},
  stores: {
    currentPage: store({}),
  },
  page: {},
  refs: {},

  getStore(name: string): StoreType {
    return globalTango.stores[name];
  },

  getStoreValue(path: string) {
    if (!path) {
      return;
    }

    const keys = path.split('.');
    let value = globalTango.stores;
    for (let i = 0; i < keys.length; i++) {
      if (value) {
        value = value[keys[i]];
      } else {
        break;
      }
    }
    return value;
  },

  setStoreValue(path: string, value: any) {
    const keys = path.split('.');
    const storeName = keys[0];
    const subStore = globalTango.stores[storeName];
    if (!subStore) {
      globalTango.stores[storeName] = {};
    }
    let context = globalTango.stores[storeName];
    for (let i = 1; i < keys.length - 1; i++) {
      context = context[keys[i]] || {};
    }
    context[keys[keys.length - 1]] = value;
  },

  clearStoreValue(path: string) {
    globalTango.setStoreValue(path, undefined);
  },

  registerStore(name: string, storeInstance: StoreType) {
    if (!globalTango.getStore(name)) {
      globalTango.stores[name] = storeInstance;
    }
  },

  getPageState(name: string) {
    return getValue(globalTango.page, name);
  },

  getPageStateValue(name: string) {
    return getValue(globalTango.page, [name, 'value'].join('.'));
  },

  setPageState(name: string, value: any) {
    if (!name) {
      return;
    }
    setValue(globalTango.page, name, value);
  },

  setPageStateValue(name: string, value: any) {
    if (!name) {
      return;
    }
    setValue(globalTango.page, [name, 'value'].join('.'), value);
  },

  clearPageState(name: string) {
    if (!name) {
      this.page = {};
    }
    delete this.page[name];
  },

  registerServices(services: any, namespace?: string) {
    if (namespace) {
      globalTango.services[namespace] = services;
    } else {
      globalTango.services = {
        ...globalTango.services,
        ...services,
      };
    }
  },
};

export default globalTango;
