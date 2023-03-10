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

  //
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
      const senderPath = levelpaths.length > 0 ? path.join(...levelpaths) : '/';
      if (item.redirect) {
        const redirectPath = path.join(senderPath, item.redirect);
        return (
          <Route
            key={senderPath}
            path={senderPath}
            element={<Navigate key={senderPath} to={redirectPath} />}
          />
        );
      }

      if (!item.path && item.component) {
        const NotFoundComponent = React.lazy(() => import(`${item.component}`));
        return <Route key={item.component} path="*" element={<NotFoundComponent />} />;
      }
      if (!item.component) {
        return (item.children || item.routes)?.length > 0
          ? this.getRoutes(item.children || item.routes, [...parentLevels, item])
          : null;
      }
      const RouteComponent = item.component ? React.lazy(() => import(`${item.component}`)) : null;
      return (
        <Route
          key={senderPath}
          path={senderPath}
          element={RouteComponent ? <RouteComponent /> : null}
        >
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
      <React.Suspense fallback={<Loading />}>
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

function Loading(props) {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* <span>加载中...</span> */}
    </div>
  );
}
