import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import rootReducer from './reducer';

// 需要用到的中间件
const middlewares = [
  // thunkMiddleware,
  // 写日志系统
  // createLogger(),
];

// 建立存储器
export default function configStore() {
  const store = createStore(rootReducer, applyMiddleware(...middlewares));
  return store;
}
