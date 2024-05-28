import React, { forwardRef, useEffect, useRef } from 'react';
import { view } from '@risingstack/react-easy-state';
import {
  Dict,
  SLOT,
  callAll,
  hoistNonReactStatics,
  isFunctionComponent,
  isInTangoDesignMode,
} from '@music163/tango-helpers';
import tangoBoot from './global';
import { mergeRefs } from './helpers';

interface IPageStateHandlers {
  getPageState: () => Dict;
  setPageState: (stateValue: Dict) => void;
}

interface RegisterStateConfig {
  /**
   * 用户自定义的组件状态
   * @param props
   * @param instance
   * @returns
   */
  getInitStates?: (handlers: IPageStateHandlers, props: any, instance: any) => any;
  /**
   * 用户自定义的触发器行为
   * @param handlers
   * @returns
   */
  getTriggerProps?: (handlers: IPageStateHandlers) => Dict;
}

interface DesignerRenderProps {
  originalProps: Record<string, any>;
  designerProps: Record<string, any>;
  children: React.ReactElement;
}

interface DesignerConfig {
  /**
   * 是否可拖拽
   */
  draggable?: boolean;
  /**
   * 是否有包裹容器
   */
  hasWrapper?: boolean;
  /**
   * 容器自定义样式
   */
  wrapperStyle?: React.CSSProperties;
  /**
   * 展示方式
   */
  display?: DndBoxProps['display'];
  /**
   * 自定义渲染
   */
  render?: (props: DesignerRenderProps) => React.ReactNode;
  /**
   * 注入给组件的默认属性
   */
  defaultProps?: Record<string, any>;
}

interface DefineComponentConfig {
  /**
   * displayName
   */
  name?: string;
  /**
   * 同步组件状态到 tango.page 上
   */
  registerState?: RegisterStateConfig;
  /**
   * 组件在设计态配置
   */
  designerConfig?: DesignerConfig;
}

interface TangoModelComponentProps extends TangoComponentProps {
  /**
   * 默认值
   */
  defaultValue?: any;
  /**
   * 内部 ref
   */
  innerRef?: React.ComponentRef<any>;
}

export interface TangoComponentProps {
  /**
   * 组件 ID （兼容旧版设计）
   */
  id?: string;
  /**
   * 组件 ID，同时用于页面内的状态访问路径
   */
  tid?: string;
}

const registerEmpty = () => ({});

// TODO：支持本地组件的属性配置设置
export function defineComponent<P = any>(
  BaseComponent: React.ComponentType<P>,
  options?: DefineComponentConfig,
) {
  const displayName =
    options?.name || BaseComponent.displayName || BaseComponent.name || 'TangoComponent';
  const designerConfig = options?.designerConfig || {};

  const isFC = isFunctionComponent(BaseComponent);

  // 这里包上 view ，能够响应 model 变化
  const InnerModelComponent = view((props: P & TangoModelComponentProps) => {
    const ref = useRef();

    const stateConfig = options?.registerState || {};

    const getPageStates = stateConfig.getInitStates || registerEmpty;
    const { tid, innerRef, ...rest } = props;

    const setPageState = (nextState: Dict) => {
      tangoBoot.setPageState(tid, nextState);
    };

    const getPageState = () => {
      return tangoBoot.getPageState(tid);
    };

    useEffect(() => {
      if (tid) {
        const customStates = getPageStates({ getPageState, setPageState }, props, ref.current);
        tangoBoot.setPageState(tid, {
          ...customStates,
        });
      }
      return () => {
        if (tid) {
          tangoBoot.clearPageState(tid);
        }
      };
    }, [tid]);

    const override: Dict = {};

    let userTriggerProps = {};
    if (tid) {
      userTriggerProps = stateConfig.getTriggerProps?.({ getPageState, setPageState });
      const handlerKeys = Object.keys(userTriggerProps);
      if (handlerKeys.length) {
        handlerKeys.forEach((key) => {
          // FIXME: 应该只需要合并 function 类型的属性，其他属性不需要合并
          if (props[key] || override[key]) {
            userTriggerProps[key] = callAll(userTriggerProps[key], override[key], props[key]);
          }
        });
      }
    }

    return (
      <BaseComponent
        {...(rest as P)}
        {...override}
        {...userTriggerProps}
        ref={mergeRefs(ref, innerRef)}
      />
    );
  });

  // TIP: view 不支持 forwardRef，这里包一层，包到内部组件去消费，外层支持访问到原始的 ref，避免与原始代码产生冲突
  const TangoComponent = forwardRef<unknown, P & TangoComponentProps>((props, ref) => {
    const { tid } = props;
    const refs = isFC ? undefined : ref;

    let ret;
    if (options?.registerState && tid) {
      ret = <InnerModelComponent innerRef={refs} {...props} />;
    } else {
      ret = <BaseComponent ref={refs} {...(props as P)} />;
    }

    if (isInTangoDesignMode()) {
      const overrideProps = designerConfig.defaultProps;

      const designerProps = {
        draggable: designerConfig.draggable ?? true,
        [SLOT.id]: tid,
        [SLOT.dnd]: props[SLOT.dnd],
      };

      if (designerConfig.render) {
        // 自定义渲染设计器样式
        return designerConfig.render({ designerProps, originalProps: props, children: ret });
      }

      if (designerConfig.hasWrapper) {
        if (overrideProps) {
          ret = React.cloneElement(ret, overrideProps);
        }
        return (
          <DndBox
            name={displayName}
            display={designerConfig.display}
            style={options.designerConfig?.wrapperStyle}
            {...designerProps}
          >
            {ret}
          </DndBox>
        );
      } else {
        return React.cloneElement(ret, {
          ...designerProps,
          ...overrideProps,
        });
      }
    } else {
      return ret;
    }
  });

  hoistNonReactStatics(TangoComponent, BaseComponent);
  TangoComponent.displayName = `defineComponent(${displayName})`;

  return TangoComponent;
}

interface DndBoxProps extends React.ComponentPropsWithoutRef<'div'> {
  name?: string;
  display?: 'block' | 'inline-block' | 'inline';
}

function DndBox({ name, display, children, style: styleProp, ...rest }: DndBoxProps) {
  const style = {
    display,
    minHeight: 4,
    ...styleProp,
  };
  return (
    <div className={`${name}-designer tango-dndBox`} style={style} {...rest}>
      {children}
    </div>
  );
}
