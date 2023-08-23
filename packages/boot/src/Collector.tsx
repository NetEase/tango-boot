import React, { useEffect } from 'react';
import { view } from '@risingstack/react-easy-state';
import globalTango from './global';

export interface CollectorRenderProps {
  value: any;
  setValue: (nextValue: any) => void;
  ref: React.Ref<any>;
}

export interface CollectorProps {
  id?: string;
  model?: string;
  defaultValue?: any;
  onValueChange?: (value: any) => void;
  render?: (props: CollectorRenderProps) => React.ReactNode;
  children?: (props: CollectorRenderProps) => React.ReactNode;
}

// TODO: 支持同步 value 以外的状态, setValue 完全交给外部来做，内部只实例化空间
export const Collector = view(
  ({ id, model, defaultValue, onValueChange, render, children }: CollectorProps) => {
    useEffect(() => {
      const storePath = `currentPage.${id}`;
      if (id) {
        globalTango.setStoreValue(storePath, {
          value: defaultValue,
        });
      }
      return () => {
        if (id) {
          globalTango.clearStoreValue(storePath);
        }
      };
    }, [id]);

    const valuePath = model || ['currentPage', id, 'value'].join('.');
    const value = globalTango.getStoreValue(valuePath);
    const componentOrFunction = render || children;
    return renderProps(componentOrFunction, {
      value,
      setValue: (nextValue: any) => {
        globalTango.setStoreValue(valuePath, nextValue);
        onValueChange?.(nextValue);
      },
      ref: (instance: any) => {
        globalTango.refs[id] = instance;
      },
    });
  },
);

const renderProps = (ComponentOrFunction: any, props: Record<string, any>) => {
  if (ComponentOrFunction.propTypes || ComponentOrFunction.prototype.render) {
    return <ComponentOrFunction {...props} />;
  }
  return ComponentOrFunction({
    ...(ComponentOrFunction.defaultProps || {}),
    ...props,
  });
};
