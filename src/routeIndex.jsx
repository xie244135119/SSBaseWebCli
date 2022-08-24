import React from 'react';
import { Switch, Redirect, Route, BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import RouteConfig from '../config/router.config';
import DefaultSetting from './defaultSetting';

export default class RouteIndex {
  // 缓存的路由列表
  static cacheRouteList = [];

  // 缓存的平铺列表
  static cacheMenu = [];

  /**
   * 路由初始化操作
   * @returns
   */
  static setupRoute = () => {
    if (this.cacheRouteList.length > 0) {
      return this.cacheRouteList;
    }
    const recursive = (routes = [], parentRoutes = []) => {
      let list = [];
      for (let index = 0; index < routes.length; index += 1) {
        const route = routes[index];
        //
        const paths = [];
        const components = [];
        const names = [];
        const addContentFunc = (aRoute) => {
          if (aRoute == null || aRoute === undefined) {
            return;
          }
          if (aRoute.path) {
            paths.push(aRoute.path);
          }
          if (aRoute.component) {
            components.push(aRoute.component);
          }
          if (aRoute.name) {
            names.push(aRoute.name);
          }
        };
        [...parentRoutes, route].forEach((item) => {
          addContentFunc(item);
        });
        // 重定向
        if (route.redirect) {
          list.push({
            type: 'Redirect',
            paths,
            redirect: route.redirect
          });
          continue;
        }
        // 没有子级
        if (!route.routes) {
          list.push({
            type: 'Route',
            paths,
            names,
            components
          });
          continue;
        }
        // 存在子级
        const childlist = recursive(route.routes, [...parentRoutes, route]);
        list = list.concat(childlist);
      }
      return list;
    };
    let list = recursive(RouteConfig);
    list = list.map((item) => ({
      ...item,
      path: this.getRoutePath(item.paths),
      // component: this.getRouteComponent(item.components),
      name: item.names?.join('-')
    }));
    this.cacheRouteList = list;
    return list;
  };

  /**
   * 菜单初始化操作
   * @param {*} aPaths
   * @returns
   */
  static setupMenu = () => {
    if (this.cacheMenu.length > 0) {
      return this.cacheMenu;
    }
    const recursive = (routes = [], parentRoutes = []) => {
      const children = [];
      for (let index = 0; index < routes.length; index += 1) {
        const route = routes[index];
        if (route.redirect) {
          continue;
        }
        //
        const paths = [...parentRoutes, route].map((item) => item.path);
        const obj = {
          paths,
          path: this.getRoutePath(paths),
          name: route.name
        };
        // 没有子级
        if (!route.routes) {
          children.push(obj);
          continue;
        }

        // 存在子级
        const childs = recursive(route.routes, [...parentRoutes, route]);
        obj.children = childs;
        children.push(obj);
      }
      return children;
    };
    const children = recursive(RouteConfig);
    console.log(' 缓存的菜单 cacheMenu ', children);
    this.cacheMenu = children;
    return this.cacheMenu;
  };

  // 获取组件地址
  static getRoutePath = (aPaths = []) => {
    let path = '';
    for (let index = aPaths.length - 1; index >= 0; index -= 1) {
      const element = aPaths[index];
      if (
        element === '' ||
        element === undefined ||
        element === null ||
        element.indexOf('/') === -1
      ) {
        continue;
      }
      if (element.startsWith('http')) {
        path = element;
        break;
      }
      // 绝对路径直接返回
      if (element.startsWith('/')) {
        path = element + path;
        break;
      }
      // 以绝对路径返回
      path = element.replaceAll('./', '') + path;
    }
    return path;
  };

  /**
   * 获取组件元素
   * @param {*} routes
   * @param {*} parentRoute
   * @returns
   */
  static getRouteComponent = (aComponents = [], props = {}) => {
    const recursive = (components = [], index = 0, ParentElement = null) => {
      if (components.length === 0) {
        return null;
      }
      const route = components[index];
      const RouteComponent = require(`${route}`).default;
      //

      const { history, location, match, staticContext } = props;
      if (index === components.length - 1) {
        if (ParentElement !== null) {
          return (
            <ParentElement
              history={history}
              location={location}
              match={match}
              staticContext={staticContext}
            >
              <RouteComponent
                history={history}
                location={location}
                match={match}
                staticContext={staticContext}
              />
            </ParentElement>
          );
        }
        return (
          <RouteComponent
            history={history}
            location={location}
            match={match}
            staticContext={staticContext}
          />
        );
      }
      return recursive(components, index + 1, RouteComponent);
    };
    const com = recursive(aComponents);
    return com;
  };

  /**
   * 获取路由元素
   * @returns
   */
  static getRoutes = () => {
    this.setupRoute();
    const routerRender = (
      <BrowserRouter
        basename={process.env.NODE_ENV === 'production' ? DefaultSetting.directory : ''}
      >
        <Switch>
          {this.cacheRouteList.map((item) => {
            if (item.type === 'Redirect') {
              return <Redirect key={item.path} exact from={item.path} to={item.redirect} />;
            }
            if (item.type === 'Route') {
              return (
                <Route
                  key={item.path || '404'}
                  path={item.path}
                  exact
                  render={(props) => {
                    const component = this.getRouteComponent(item.components, props);
                    return component;
                  }}
                />
              );
            }
            return null;
          })}
        </Switch>
      </BrowserRouter>
    );
    return routerRender;
  };

  /**
   * dom渲染元素
   */
  static renderDom = () => {
    //
    const routes = this.getRoutes();
    ReactDOM.render(routes, document.getElementById('root'));
  };

  /**
   * 获取缓存的路由类
   */
  static getCacheRoutes = () => {
    this.setupRoute();
    return this.cacheRouteList;
  };

  /**
   * 获取路由地址
   * @param {*} aPath
   */
  static getRouteByPath = (aPath = '') => {
    this.setupRoute();
    const findRoute = this.cacheRouteList.find((item) => item.path === aPath) || {};
    return findRoute;
  };

  /**
   * 获取缓存的菜单列表
   */
  static getMenu = () => {
    this.setupMenu();
    const menuRoutes = this.cacheMenu.filter((item) => item.path === '/') || [];
    const [route = {}] = menuRoutes;
    return route.children || [];
  };
}
