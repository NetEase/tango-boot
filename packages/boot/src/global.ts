import { store } from '@risingstack/react-easy-state';

type StoreType = ReturnType<typeof store>;

const globalTango = {
  config: {},
  services: {},
  stores: {},

  getStore(name: string): StoreType {
    return globalTango.stores[name];
  },

  registerStore(name: string, store: StoreType) {
    if (!globalTango.getStore(name)) {
      globalTango.stores[name] = store;
    }
  },

  registerServices(services: any) {
    globalTango.services = services;
  },
};

// Object.freeze(globalTango);

export default globalTango;
