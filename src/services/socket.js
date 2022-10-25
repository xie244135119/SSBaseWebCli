/*
 * Author  Murphy.xie
 * Date  2022-09-14 16:10:38
 * LastEditors  Murphy.xie
 * LastEditTime  2022-10-15 10:57:04
 * Description
 */

class SocketJs {
  /**
   * 全局通道
   */
  static globalSocket = new SocketJs(window.ENV.socketSource);

  /**
   * 相关通讯标识
   */
  static SocketType = {};

  // socket通道
  _webSocket = null;

  // interval timer
  _beatTimer = null;

  // 请求的socket 地址
  _socketUrl = '';

  // 事件处理函数
  _observerFunc = {};

  // 全量监听
  _listenerFunc = () => {};

  // reconnect count
  _retryConnecCount = 0;

  /**
   * 销毁
   */
  destory = () => {
    this.disconnect();
    this._observerFunc = {};
    this._retryConnecCount = 0;
    clearInterval(this._beatTimer);
    this._beatTimer = null;
  };

  constructor(aWsurl = window.ENV.socketSource) {
    this._socketUrl = aWsurl;
    this._initWebSocket(aWsurl);
  }

  /**
   * WebSocket 初始化操作
   * @param {*} aWsurl websocket地址
   */
  _initWebSocket = (aWsurl) => {
    if (!aWsurl) return;

    const ws = new WebSocket(aWsurl);
    this._webSocket = ws;
    ws.onopen = () => {
      console.log(' open websocket ');
    };

    ws.onmessage = (e) => {
      if (e.data.indexOf('连接成功') !== -1) {
        this._startHeartbeat();
        return;
      }

      if (e.data.indexOf('websocket interval heartbeat') !== -1) {
        return;
      }
      try {
        console.log(' socket 收到消息 ', e);
        this._listenerFunc?.(e.data);
        const [aType, senderData] = this._parseData(e.data) || [];
        this.onPush(aType, senderData);
      } catch (error) {
        //
      }

      // 清空重试次数
      this._retryConnecCount = 0;
    };

    ws.onerror = (web, e) => {
      console.error(' websocket connect error ', web, e);
      // 连接失败，重连三次
      this._reconnectWebSocket(aWsurl);
    };

    ws.onclose = () => {
      console.error(' websocket close ');
      this._reconnectWebSocket();
    };
  };

  /**
   * WebSocket 重连操作
   * @param {*} aWsurl
   */
  _reconnectWebSocket = (aWsurl = this._socketUrl) => {
    // 先断开之前的连接
    if (this._webSocket && this._webSocket !== null) {
      this._webSocket.close();
      this._webSocket = null;
    }

    // 重连 不超过三次
    if (this._retryConnecCount >= 3) {
      return;
    }
    console.log(` websocket retry ${this._retryConnecCount}次`);
    this._retryConnecCount += 1;
    this._initWebSocket(aWsurl);
  };

  /**
   * 建立通道监听
   * @param {*} aCallBack
   */
  onAddObserver = (aType = '', aCallBack = () => {}) => {
    const handle = Symbol(`${aType} listener`);
    this._observerFunc[handle] = {
      type: aType,
      func: aCallBack
    };
    return handle;
  };

  /**
   * 建立全部通道监听
   */
  onListener = (aCallBack = () => {}) => {
    this._listenerFunc = aCallBack;
  };

  /**
   * 移除通道监听
   * @param {*} aCallBack
   */
  onRemoveObserver = (handle) => {
    delete this._observerFunc[handle];
  };

  // 发送数据
  send = (type = '', data = {}) => {
    if (!this._webSocket) {
      this._initWebSocket(this._socketUrl);
    }
    this._webSocket.send(JSON.stringify({ type, data }));
  };

  /**
   * //
   * @param {*} data
   */
  sendOrigin = (data = {}) => {
    if (!this._webSocket) {
      this._initWebSocket(this._socketUrl);
    }
    this._webSocket.send(JSON.stringify(data));
  };

  /**
   * 本地mock推送
   */
  onPush = (aType = '', aData = {}) => {
    const symbols = Object.getOwnPropertySymbols(this._observerFunc);
    for (let index = 0; index < symbols.length; index += 1) {
      const handle = symbols[index];
      const { type, func } = this._observerFunc[handle];
      if (type === aType) {
        func?.(aData);
      }
    }
  };

  /**
   * 断开连接
   */
  disconnect = () => {
    if (this._webSocket && this._webSocket !== null) {
      // 关闭连接
      this._webSocket.close();
      this._webSocket = null;
    }
  };

  // 数据解析
  _parseData = (aData = '') => {
    try {
      let jsonText = aData;
      const findValidIndex = jsonText.indexOf('(From Server');
      if (findValidIndex !== -1) {
        jsonText = jsonText.substring(0, findValidIndex);
      }
      const obj = JSON.parse(jsonText) || {};
      // console.log(' websocket  收到的数据 ', obj);
      return [obj.type, obj.data];
    } catch (error) {
      // console.log(' websocket 收到的数据解析失败 ', aData, error);
      return undefined;
    }
  };

  /**
   * 定时心跳
   */
  _startHeartbeat = () => {
    this._beatTimer = setInterval(() => {
      if (this._webSocket) {
        this._webSocket.send('websocket interval heartbeat');
      } else {
        this._initWebSocket(this._socketUrl);
      }
    }, 50 * 1000);
  };
}

export default SocketJs;
