/* eslint-disable max-classes-per-file */
import React from 'react';
import path from 'path';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import RouteConfig from '../config/router.config';
import DefaultSetting from './defaultSetting';
import CreateStore from '@/store/store';

function AsyncComponent(aAsyncComponent = new Promise()) {
  // function AsyncLoadComponent(props) {
  //   const [RouteCompnent, setRouteComponent] = useState(null);

  //   useEffect(() => {
  //     aAsyncComponent.then((res) => {
  //       setRouteComponent(res.default);
  //     });
  //   }, []);
  //   console.log(' 组件加载成功 ', RouteCompnent);
  //   // eslint-disable-next-line react/jsx-props-no-spreading
  //   return RouteCompnent ? <RouteCompnent {...props} /> : null;
  // }

  class AsyncLoadComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        RouteCompnent: null
      };
    }

    componentDidMount() {
      aAsyncComponent.then((res) => {
        this.setState({ RouteCompnent: res.default });
      });
    }

    render() {
      const { RouteCompnent } = this.state;
      console.log(' RouteCompnent ', RouteCompnent);
      // eslint-disable-next-line react/jsx-props-no-spreading
      return RouteCompnent ? <RouteCompnent {...this.props} /> : null;
    }
  }

  return AsyncLoadComponent;
}

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
      if (!item.path && item.component) {
        return <Route key={item.path} component={require(`${item.component}`).default} />;
      }
      // const RouteComponent = React.lazy(() => import(`${item.component}`));
      // const RouteComponent = React.lazy(() => import('./pages/ansycindex'));
      // return <RouteComponent key={item.path} />;
      const RouteComponent = AsyncComponent(import(`${item.component}`));
      console.log(' RouteComponent ', RouteComponent);
      return (
        <Route key={compaths} path={compaths}>
          <RouteComponent>
            {item.children?.length > 0
              ? this.getRoutes(item.children, [...parentLevels, item])
              : null}
            {item.routes?.length > 0 ? this.getRoutes(item.routes, [...parentLevels, item]) : null}
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
