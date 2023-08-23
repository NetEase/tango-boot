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
  router?: {
    config: RouteConfig[];
    type?: 'browser' | 'hash';
    basename?: string;
  };
  /**
   * 路由配置, router.config 的快捷写法
   */
  routes: RouteConfig[];
  /**
   * 根组件的父容器设置，传入的组件将一次作为应用根节点的父级组件
   */
  providers?: React.ReactElement[];
}

export function runApp(config: RunAppConfig) {
  if ((window as any).__POWERED_BY_QIANKUN__ && config.boot.qiankun) {
    runQiankunApp(config);
  } else {
    runReactApp(config);
  }
}

function runReactApp(config: RunAppConfig) {
  const routes = config.router?.config ?? config.routes;
  const history = config.router?.type === 'hash' ? createBrowserHistory() : createHashHistory();
  // eslint-disable-next-line react/no-deprecated
  ReactDOM.render(<ReactRouterApp history={history} routes={routes} />, config.boot.mountElement);
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
