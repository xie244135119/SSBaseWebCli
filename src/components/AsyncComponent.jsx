import React, { useState, useEffect } from 'react';

export default function asyncComponent(aAsyncComponent = new Promise()) {
  function AsyncComponent(props) {
    const [RouteCompnent, setRouteComponent] = useState(null);

    useEffect(() => {
      aAsyncComponent.then((res) => {
        setRouteComponent(res.default);
      });
    }, []);
    console.log(' 组件加载成功 ', RouteCompnent);
    // eslint-disable-next-line react/jsx-props-no-spreading
    return RouteCompnent ? <RouteCompnent {...props} /> : null;
  }
  return AsyncComponent;
}
