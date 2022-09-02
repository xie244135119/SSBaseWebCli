import RouteIndex from './routeIndex';
// import React from 'react';
// import ReactDom from 'react-dom';
// import App from './pages/app';

// eslint-disable-next-line no-unused-expressions
require('@/services/mock');

// 页面布局
const appElement = document.getElementById('root');
appElement.style.width = '100%';
appElement.style.height = '100%';
//
RouteIndex.renderDom();

// ReactDom.render(React.createElement(App), document.getElementById('root'));
