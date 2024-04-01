import React from 'react';
import path from 'path-browserify';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import RouteConfig from '../config/router.config';
import ProjectConfig from '../config/project.config';

const modules = import.meta.glob([
  './layouts/*.*sx',
  './pages/*.*sx',
  './pages/*/*.*sx',
  './pages/*/*/*.*sx',
  './pages/*/*/*/*.*sx'
]);

function Loading() {
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

export default class RouteIndex {
  /**
   * routes
   * @param {*} aPaths paths
   * @returns
   */
  static getRoutes = (items = [], parentLevels = [], allRouteItems = []) =>
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

      let componentPromise = null;
      const findKey = Object.keys(modules).find(
        (key) =>
          key === item.component ||
          key === `${item.component}.jsx` ||
          key === `${item.component}.tsx` ||
          key === `${item.component}/index` ||
          key === `${item.component}/index.tsx` ||
          key === `${item.component}/index.jsx`
      );
      if (findKey) {
        componentPromise = modules[findKey];
      }
      if (!item.path && item.component) {
        const NotFoundComponent = React.lazy(componentPromise);
        return <Route key={item.component} path="*" element={<NotFoundComponent />} />;
      }
      const RouteComponent = React.lazy(componentPromise);
      let childRoutes = null;
      if ((item.children || item.routes)?.length > 0) {
        childRoutes = this.getRoutes(
          item.children || item.routes,
          [...parentLevels, item],
          allRouteItems
        );
      }
      if (!item.component) {
        return childRoutes;
      }
      allRouteItems.push({
        ...item,
        path: senderPath
      });
      return (
        <Route
          key={senderPath}
          path={senderPath}
          element={RouteComponent ? <RouteComponent routes={allRouteItems} /> : null}
        >
          {/* {(item.children || item.routes)?.length > 0
            ? this.getRoutes(item.children || item.routes, [...parentLevels, item])
            : null} */}
          {childRoutes}
        </Route>
      );
    });

  /**
   * render routes
   * @returns
   */
  static getRenderRoutes = () => {
    const routerRender = (
      <React.Suspense fallback={<Loading />}>
        <BrowserRouter basename={ProjectConfig.directory}>
          <Routes>{this.getRoutes(RouteConfig)}</Routes>
        </BrowserRouter>
      </React.Suspense>
    );
    return routerRender;
  };

  /**
   * dom render
   */
  static renderDom = () => {
    const routes = this.getRenderRoutes();
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const root = createRoot(app);
    root.render(routes);
  };
}
