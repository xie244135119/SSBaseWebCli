import RouteIndex from './routeIndex';
import ProjectConfig from '../config/project.config';
import './index.module.css';

RouteIndex.renderDom();

console.log(
  `%c 系统版本 %c ${__APP_VERSION__} `,
  'background: #35495e; padding: 4px; border-radius: 3px 0 0 3px; color: #fff',
  'background: #41b883; padding: 4px; border-radius: 0 3px 3px 0; color: #fff'
);

document.title = ProjectConfig.title;
