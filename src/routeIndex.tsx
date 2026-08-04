import React from 'react';
import path from 'path-browserify';
import { RecoilRoot } from 'recoil';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import RouteConfig from 'config/router.config';
import ProjectConfig from 'config/project.config';
import Loading from './pages/Loading/index';
import ErrorBoundary from './pages/Error';

const modules = import.meta.glob([
  './layouts/**/*.{tsx,jsx,ts,js}',
  './pages/**/*.{tsx,jsx,ts,js}'
]);

type ModuleLoader = () => Promise<{ default: React.ComponentType<any> }>;

export default class RouteIndex {
  /**
   * routes
   * @param {*} aPaths paths
   * @returns
   */
  static getRoutes = (
    items: RouteConfigItem[] = [],
    parentLevels: RouteConfigItem[] = [],
    allRouteItems: RouteConfigItem[] = []
  ): React.ReactNode[] =>
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

      let componentPromise: ModuleLoader | null = null;
      const findKey = Object.keys(modules).find(
        (key) =>
          key === item.component ||
          key.startsWith(`${item.component}.`) ||
          key === `${item.component}/index` ||
          key.startsWith(`${item.component}/index.`)
      );
      if (findKey) {
        componentPromise = modules[findKey] as ModuleLoader;
      } else if (item.component) {
        // eslint-disable-next-line no-console
        console.warn(
          `[router] 找不到路由组件: ${item.component}（路径: ${item.path}）。` +
            '请确认组件文件存在且在 ./pages 或 ./layouts 目录下。'
        );
      }
      if (!item.path && item.component) {
        const NotFoundComponent = React.lazy(componentPromise as ModuleLoader);
        return <Route key={item.component} path="*" element={<NotFoundComponent />} />;
      }
      const RouteComponent = React.lazy(componentPromise as ModuleLoader);
      let childRoutes: React.ReactNode[] | null = null;
      const childItems = item.children || item.routes;
      if (childItems && childItems.length > 0) {
        childRoutes = this.getRoutes(childItems, [...parentLevels, item], allRouteItems);
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
      <RecoilRoot>
        <ErrorBoundary>
          <React.Suspense fallback={<Loading />}>
            <BrowserRouter basename={ProjectConfig.directory}>
              <Routes>{this.getRoutes(RouteConfig)}</Routes>
            </BrowserRouter>
          </React.Suspense>
        </ErrorBoundary>
      </RecoilRoot>
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
