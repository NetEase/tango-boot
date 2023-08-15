import React from 'react';
import { view } from '@risingstack/react-easy-state';

export function definePage(BaseComponent: React.ComponentType<any>) {
  const Page = view(BaseComponent);
  return Page;
}
