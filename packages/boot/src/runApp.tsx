import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { RouteConfig, renderRoutes } from 'react-router-config';
import { History, createBrowserHistory, createHashHistory } from 'history';

export interface RunAppConfig {
  /**
   * 启动项配置
   */
  boot: {
    mountElement: HTMLElement;
    qiankun: false | { appName: string };
  };
  /**
   * 单个页面应用的根组件，适合不需要前端路由的情况
   */
  singleEntry?: React.ComponentType;
  /**
   * 多页应用路由配置, router.config 的快捷写法
   */
  routes: RouteConfig[];
  /**
   * 路由配置
   */
  router?: {
    config: RouteConfig[];
    type?: 'browser' | 'hash';
  };
  /**
   * 根组件的父容器设置，传入的组件将一次作为应用根节点的父级组件
   */
  providers?: AppContainerProps['providers'];
}

export function runApp(config: RunAppConfig) {
  if ((window as any).__POWERED_BY_QIANKUN__ && config.boot.qiankun) {
    runQiankunApp(config);
  } else {
    runReactApp(config);
  }
}

function runReactApp(config: RunAppConfig) {
  let element;
  const routes = config.router?.config ?? config.routes;
  if (routes) {
    // react router app
    const routerType = config.router?.type ?? 'hash';
    const history = routerType === 'hash' ? createBrowserHistory() : createHashHistory();
    element = <ReactRouterApp history={history} routes={routes} />;
  } else {
    // single entry app
    const SingleEntry = config.singleEntry || 'div';
    element = <SingleEntry />;
  }
  // eslint-disable-next-line react/no-deprecated
  ReactDOM.render(
    <AppContainer providers={config.providers}>{element}</AppContainer>,
    config.boot.mountElement,
  );
}

function runQiankunApp(config: RunAppConfig) {
  // FIXME: 需要支持从外层传入 mountId
  const mountId = '#root';
  return {
    bootstrap() {
      return Promise.resolve({});
    },

    mount() {
      runReactApp(config);
    },

    unmount(props: any) {
      const target = props.container ?? document;
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.unmountComponentAtNode(target.querySelector(mountId));
    },
  };
}

interface AppContainerProps {
  providers?: React.ReactElement[];
  children: React.ReactNode;
}

function AppContainer({ children: childrenProp, providers = [] }: AppContainerProps) {
  let children = childrenProp;
  if (providers && providers.length) {
    children = providers.reduce((prev, provider) => {
      if (React.isValidElement(provider)) {
        return React.cloneElement(provider, {}, prev);
      }
      return prev;
    }, childrenProp);
  }
  return <>{children}</>;
}

interface ReactRouterAppProps {
  history: History;
  routes: RouteConfig[];
}

function ReactRouterApp({ history, routes = [] }: ReactRouterAppProps) {
  if (!routes.find((route) => !route.path)) {
    // 如果用户没有定义 404 路由，则自动添加一个
    routes.push({
      component: NotFound,
    });
  }
  return <Router history={history}>{renderRoutes(routes)}</Router>;
}

function NotFound() {
  return <div>not found</div>;
}
