import React from 'react';
import path from 'path-browserify';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
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
   * routes
   * @param {*} aPaths paths
   * @returns
   */
  static getRoutes = (items = [{}], parentLevels = []) =>
    items.map((item) => {
      const levelpaths = [...parentLevels, item]
        .map((level) => level.path || '')
        .filter((level) => level !== '');
      const compaths = levelpaths.length > 0 ? path.join(...levelpaths) : '/';
      if (item.redirect) {
        return <Route key={item.path} element={<Navigate key={item.path} to={item.redirect} />} />;
      }
      const RouteComponent = React.lazy(() => import(`${item.component}`));
      if (!item.path && item.component) {
        return <Route key={item.component} element={<RouteComponent />} />;
      }
      return (
        <Route key={compaths} path={compaths} element={<RouteComponent />}>
          {(item.children || item.routes)?.length > 0
            ? this.getRoutes(item.children || item.routes, [...parentLevels, item])
            : null}
        </Route>
      );
    });

  /**
   * render routes
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
            <Routes>{this.getRoutes(RouteConfig)}</Routes>
          </BrowserRouter>
        </Provider>
      </React.Suspense>
    );
    return routerRender;
  };

  /**
   * dom render
   */
  static renderDom = () => {
    const routes = this.getRenderRoutes();
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.append(rootElement);
    const root = createRoot(rootElement);
    root.render(routes);
  };
}
