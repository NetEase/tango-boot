import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
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
  routes: any[];
  /**
   * 根组件的父容器设置，传入的组件将一次作为应用根节点的父级组件
   */
  providers?: React.ReactElement[];
};

export function runApp(config: RunAppConfigType) {
  ReactDOM.render(
    <Router history={createBrowserHistory()}></Router>,
    config.boot.mountElement
  );
}
