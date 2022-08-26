import React from 'react';
import path from 'path';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
// import path from 'path';
import ReactDOM from 'react-dom';
import RouteConfig from '../config/router.config';
import DefaultSetting from './defaultSetting';

export default class RouteIndex {
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
      if (!item.path && item.component) {
        return <Route component={require(`${item.component}`).default} />;
      }
      const RouteComponent = React.lazy(() => import(`${item.component}`));
      return (
        <Route path={compaths}>
          <RouteComponent>
            {item.children?.length > 0
              ? this.getRoutes(item.children, [...parentLevels, item])
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
    const routerRender = (
      <React.Suspense fallback={<div>加载中...</div>}>
        <BrowserRouter
          basename={process.env.NODE_ENV === 'production' ? DefaultSetting.directory : ''}
        >
          <Switch>{this.getRoutes(RouteConfig)}</Switch>
        </BrowserRouter>
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
