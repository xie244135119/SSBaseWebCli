import RouteIndex from "./routeIndex";

// eslint-disable-next-line no-unused-expressions
require("@/services/mock");

// 页面布局
const appElement = document.getElementById("app");
appElement.style.width = `100%`;
appElement.style.height = `100%`;
//
RouteIndex.renderDom();
