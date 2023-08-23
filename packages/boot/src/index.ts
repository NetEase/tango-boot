import globalTango from './global';

// browser
if (typeof window !== 'undefined') {
  (window as any).tango = globalTango;
}

export default globalTango;

export * from './definePage';
export * from './defineServices';
export * from './defineStore';
export * from './runApp';
export * from './Collector';

export * from '@risingstack/react-easy-state';
