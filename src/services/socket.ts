export type SocketListenerType = (e: any) => void;

type ObserverFuncMap = { [key: symbol]: { type: string; func: (data: any) => void } };

export default class SocketJs {
  /**
   * 相关通讯标识
   */
  static SocketType: Record<string, any> = {};

  // socket通道
  private _webSocket: WebSocket | null = null;

  // interval timer
  private _beatTimer: ReturnType<typeof setInterval> | null = null;

  // 请求的socket 地址
  private _socketUrl = '';

  // 事件处理函数
  private _observerFunc: ObserverFuncMap = {} as ObserverFuncMap;

  // 全量监听
  onListener: SocketListenerType | null = null;

  // reconnect count
  private _retryConnecCount = 0;

  /**
   * 销毁
   */
  destroy = () => {
    this.disconnect();
    this._observerFunc = {} as ObserverFuncMap;
    this._retryConnecCount = 0;
    if (this._beatTimer) {
      clearInterval(this._beatTimer);
      this._beatTimer = null;
    }
  };

  constructor(aWsurl: string) {
    this._socketUrl = aWsurl;
    this._initWebSocket(aWsurl);
  }

  _initWebSocket = (aWsurl: string) => {
    if (!aWsurl) return;

    const ws = new WebSocket(aWsurl);
    this._webSocket = ws;
    ws.onopen = () => {
      // websocket 已连接
    };

    ws.onmessage = (e: MessageEvent) => {
      if (e.data.indexOf('连接成功') !== -1) {
        this._startHeartbeat();
        return;
      }

      if (e.data.indexOf('websocket interval heartbeat') !== -1) {
        return;
      }
      try {
        this.onListener?.(e.data);
        const [aType, senderData] = this._parseData(e.data) || [];
        this.onPush(aType, senderData);
      } catch (error) {
        //
      }

      // 清空重试次数
      this._retryConnecCount = 0;
    };

    ws.onerror = () => {
      // console.error(' websocket connect error ', web, ev);
      // 连接失败，重连三次
      this._reconnectWebSocket(aWsurl);
    };

    ws.onclose = () => {
      this._reconnectWebSocket();
    };
  };

  /**
   * WebSocket 重连操作
   * @param {*} aWsurl
   */
  _reconnectWebSocket = (aWsurl = this._socketUrl) => {
    // 先断开之前的连接
    if (this._webSocket) {
      this._webSocket.close();
      this._webSocket = null;
    }

    // re connect
    if (this._retryConnecCount >= 3) {
      return;
    }
    // websocket 重试
    this._retryConnecCount += 1;
    this._initWebSocket(aWsurl);
  };

  /**
   * 建立通道监听
   * @param {*} aCallBack
   */
  onAddObserver = (aType = '', aCallBack: (data: any) => void = () => {}) => {
    const handle = Symbol(`${aType} listener`);
    this._observerFunc[handle] = {
      type: aType,
      func: aCallBack
    };
    return handle;
  };

  /**
   * 移除通道监听
   * @param {*} aCallBack
   */
  onRemoveObserver = (handle: symbol) => {
    delete this._observerFunc[handle];
  };

  // 发送数据
  send = (type = '', data = {}) => {
    if (!this._webSocket) {
      this._initWebSocket(this._socketUrl);
    }
    this._webSocket?.send(JSON.stringify({ type, data }));
  };

  /**
   * //
   * @param {*} data
   */
  sendOrigin = (data = {}) => {
    if (!this._webSocket) {
      this._initWebSocket(this._socketUrl);
    }
    this._webSocket?.send(JSON.stringify(data));
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
    if (this._webSocket) {
      // 关闭连接
      this._webSocket.close();
      this._webSocket = null;
    }
  };

  // 数据解析
  _parseData = (aData = ''): [string, any] | undefined => {
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
