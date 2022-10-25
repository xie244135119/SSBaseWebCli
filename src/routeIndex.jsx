import React from 'react';
import path from 'path';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import RouteConfig from '../config/router.config';
import DefaultSetting from './defaultSetting';
import CreateStore from '@/store/store';

export default class RouteIndex {
  /**
   * global store
   */
  static globalStore = CreateStore();

  /**
   * 获取组件地址
   * @param {*} aPaths 一组路径
   * @returns
   */
  static getRoutes = (items = [{}], parentLevels = []) =>
    items.map((item) => {
      const levelpaths = [...parentLevels, item]
        .map((level) => level.path || '')
        .filter((level) => level !== '');
      const compaths = levelpaths.length > 0 ? path.join(...levelpaths) : '/';
      if (item.redirect) {
        return <Redirect key={item.path} exact from={compaths} to={item.redirect} />;
      }
      // const RouteComponent = React.lazy(() => import(`${item.component}`));
      const RouteComponent = require(`${item.component}`).default;
      if (!item.path && item.component) {
        return <Route key={item.path} component={RouteComponent} />;
      }
      return (
        <Route
          key={compaths}
          path={compaths}
          exact={(item.children || item.routes || []).length === 0}
        >
          <RouteComponent>
            {(item.children || item.routes)?.length > 0
              ? this.getRoutes(item.children || item.routes, [...parentLevels, item])
              : null}
          </RouteComponent>
        </Route>
      );
    });

  /**
   * 获取路由元素
   * @returns
   */
  static getRenderRoutes = () => {
    this.globalStore.subscribe(() => {
      //
    });
    const routerRender = (
      <React.Suspense fallback={<div>加载中...</div>}>
        <Provider store={this.globalStore}>
          <BrowserRouter
            basename={process.env.NODE_ENV === 'production' ? DefaultSetting.directory : ''}
          >
            <Switch>{this.getRoutes(RouteConfig)}</Switch>
          </BrowserRouter>
        </Provider>
      </React.Suspense>
    );
    return routerRender;
  };

  /**
   * dom渲染元素
   */
  static renderDom = () => {
    const routes = this.getRenderRoutes();
    ReactDOM.render(routes, document.getElementById('root'));
  };
}
