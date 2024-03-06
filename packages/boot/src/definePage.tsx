import React from 'react';
import { store, view } from '@risingstack/react-easy-state';
import globalTango from './global';

export function definePage(BaseComponent: React.ComponentType<any>) {
  globalTango.page = store({});
  const Page = view(BaseComponent);
  return Page;
}
