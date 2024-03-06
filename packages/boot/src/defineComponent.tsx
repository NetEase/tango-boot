import React, { forwardRef, useEffect, useRef } from 'react';
import { view } from '@risingstack/react-easy-state';
import { hoistNonReactStatics, isFunction, isFunctionComponent } from '@music163/tango-helpers';
import tangoBoot from './global';
import { mergeRefs } from './helpers';

interface RegisterValueConfig {
  /**
   * 绑定的 value 属性名
   */
  valuePropName?: string;
  /**
   * 设置收集字段值变更的时机
   */
  trigger?: string;
  /**
   * 设置从事件回调中获取 value 值的方法
   */
  getValueFromEvent?: (...args: any[]) => any;
}

interface DefineComponentConfig {
  /**
   * displayName
   */
  name?: string;
  /**
   * 从组件同步值到 model 的配置
   */
  registerValue?: false | RegisterValueConfig;
  /**
   * 注册自定义的组件状态或行为
   * @returns
   */
  registerPageStates?: (
    state: { setValue: (nextValue: any) => any; getValue: () => any },
    ref: any,
  ) => any;
}

export interface TangoComponentProps {
  /**
   * 组件的 ID -- 用户跟踪组件，并自动将组件的值绑定到 model 上；同时用作 track id
   */
  tid?: string;
  /**
   * 默认值
   */
  defaultValue?: any;
  /**
   * @deprecated 直接用 ref
   */
  innerRef?: React.ComponentRef<any>;
}

export interface TangoComponentBaseProps {
  /**
   * 值改变时的回调
   */
  onChange?: (...args: any[]) => object;
}

const registerEmpty = () => ({});

// TODO: 合并 withDnd 和 defineComponent

export function defineComponent<P extends TangoComponentBaseProps = TangoComponentBaseProps>(
  BaseComponent: React.ComponentType<P>,
  options?: DefineComponentConfig,
) {
  const displayName =
    options?.name || BaseComponent.displayName || BaseComponent.name || 'ModelComponent';

  const isFC = isFunctionComponent(BaseComponent);

  // 这里包上 view ，能够响应 model 变化
  const InnerModelComponent = view((props: P & TangoComponentProps) => {
    const config = options?.registerValue || {};

    const valuePropName = config.valuePropName || 'value';
    const trigger = config.trigger || 'onChange';
    const getValueFromEvent = config.getValueFromEvent;
    const registerPageStates = options?.registerPageStates || registerEmpty;
    const { tid, defaultValue, innerRef, ...rest } = props;

    // TODO: 所有属性增加一层 template 解析 prop="{{input1.value}}" 进行一下替换

    const ref = useRef();
    useEffect(() => {
      if (tid) {
        const setValue = (nextValue: any) => {
          tangoBoot.setPageState([tid, 'value'].join('.'), nextValue);
        };
        const getValue = () => {
          return tangoBoot.getPageStateValue(tid);
        };
        const customStates = registerPageStates({ setValue, getValue }, ref.current);
        tangoBoot.setPageState(tid, {
          value: defaultValue,
          setValue(newValue: any) {
            setValue(newValue);
          },
          clear() {
            setValue(undefined);
          },
          ...customStates,
        });
      }
      return () => {
        tangoBoot.clearPageState(tid);
      };
    }, [tid, defaultValue, registerPageStates]);

    const value = tangoBoot.getPageStateValue(tid);

    const onChangeProp = rest[trigger];
    const onChange = (next: any, ...args: any[]) => {
      const nextValue = isFunction(getValueFromEvent) ? getValueFromEvent(next, ...args) : next;
      if (tid) {
        tangoBoot.setPageStateValue(tid, nextValue);
      }

      if (isFunction(onChangeProp)) {
        onChangeProp(next, ...args);
      }
    };

    const override = {
      [valuePropName]: value ?? defaultValue,
      [trigger]: onChange,
      'data-id': tid,
    };

    return <BaseComponent {...(rest as P)} {...override} ref={mergeRefs(ref, innerRef)} />;
  });

  const TangoComponent = forwardRef<unknown, P & TangoComponentProps>((props, ref) => {
    const { tid, innerRef, ...rest } = props;

    const refs = isFC ? undefined : mergeRefs(ref, innerRef); // innerRef 兼容旧版本

    if (!tid && options.registerValue) {
      return <BaseComponent ref={refs} {...(rest as P)} />;
    }

    // TIP: view 不支持 forwardRef，这里包一层，包到内部组件去消费，外层支持访问到原始的 ref
    return <InnerModelComponent {...props} innerRef={refs} />;
  });

  hoistNonReactStatics(TangoComponent, BaseComponent);
  TangoComponent.displayName = `defineComponent(${displayName})`;

  return TangoComponent;
}
