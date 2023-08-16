import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { RouteConfig, renderRoutes } from 'react-router-config';
import { createBrowserHistory } from 'history';

export type RunAppConfigType = {
  /**
   * 启动项配置
   */
  boot: {
    mountElement: HTMLElement;
    qiankun: false | { appName: string };
  };
  /**
   * 路由配置
   */
  routes: RouteConfig[];
  /**
   * 根组件的父容器设置，传入的组件将一次作为应用根节点的父级组件
   */
  providers?: React.ReactElement[];
};

export function runApp(config: RunAppConfigType) {
  if ((window as any).__POWERED_BY_QIANKUN__ && config.boot.qiankun) {
    runQiankunApp(config);
  } else {
    runReactApp(config);
  }
}

function runReactApp(config: RunAppConfigType) {
  ReactDOM.render(
    <ReactRouterApp routes={config.routes} />,
    config.boot.mountElement
  );
}

function runQiankunApp(config: RunAppConfigType) {
  // FIXME: 需要支持从外层传入 mountId
  const mountId = '#root';
  return {
    bootstrap() {
      return Promise.resolve({});
    },

    mount(props: any) {
      runReactApp(config);
    },

    unmount(props: any) {
      const target = props.container ?? document;
      ReactDOM.unmountComponentAtNode(target.querySelector(mountId));
    },
  };
}

interface ReactRouterAppProps {
  routes?: RouteConfig[];
}

function ReactRouterApp({ routes = [] }: ReactRouterAppProps) {
  if (!routes.find((route) => !route.path)) {
    // 如果用户没有定义 404 路由，则自动添加一个
    routes.push({
      component: NotFound,
    });
  }
  return (
    <Router history={createBrowserHistory()}>{renderRoutes(routes)}</Router>
  );
}

function NotFound() {
  return <div>not found</div>;
}
