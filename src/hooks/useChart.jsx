import React, { useEffect, useRef } from 'react';
import * as Echarts from 'echarts';

console.log(' Echarts ', Echarts);
export default function useChart(initialState) {
  const { options } = initialState;

  //
  const divElementRef = useRef();
  //
  const chartInstanceRef = useRef();

  useEffect(() => {
    const instance = Echarts.init(divElementRef.current);
    chartInstanceRef.current = instance;
    instance.setOption(options);

    const o = new ResizeObserver(() => {
      console.log(' xxxx ');
      instance.resize();
    });
    return () => {
      o.disconnect();
      instance.clear();
    };
  }, []);

  const element = <div ref={divElementRef} style={{ width: '100%', height: '100%' }} />;

  return {
    element
  };
}
