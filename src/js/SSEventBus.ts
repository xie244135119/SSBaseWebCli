type EventCallback = (...args: any[]) => void;

interface EventBus {
  // 订阅事件
  on(event: string | symbol, callback: EventCallback): () => void;
  // 一次性订阅（触发后自动取消）
  once(event: string | symbol, callback: EventCallback): () => void;
  // 发布事件
  emit(event: string | symbol, ...args: any[]): void;
  // 取消订阅
  off(event: string | symbol, callback?: EventCallback): void;
  // 清除所有事件
  clear(): void;
}

// 创建发布订阅实例
const createEventBus = (): EventBus => {
  // 存储事件回调映射
  const eventMap = new Map<string | symbol, Set<EventCallback>>();

  // 获取事件回调集合（不存在则创建）
  const getCallbacks = (event: string | symbol): Set<EventCallback> => {
    if (!eventMap.has(event)) {
      eventMap.set(event, new Set());
    }
    return eventMap.get(event)!;
  };

  return {
    on(event, callback) {
      const callbacks = getCallbacks(event);
      callbacks.add(callback);
      // 返回取消订阅的函数
      return () => this.off(event, callback);
    },

    once(event, callback) {
      const wrapper: EventCallback = (...args) => {
        callback(...args);
        this.off(event, wrapper);
      };
      return this.on(event, wrapper);
    },

    emit(event, ...args) {
      const callbacks = getCallbacks(event);
      // 复制一份回调集合，避免执行过程中修改原集合导致的问题
      Array.from(callbacks).forEach((cb) => cb(...args));
    },

    off(event, callback) {
      if (!eventMap.has(event)) return;
      const callbacks = getCallbacks(event);
      if (callback) {
        callbacks.delete(callback);
      } else {
        // 未指定回调，清除该事件所有回调
        callbacks.clear();
      }
      // 空集合则删除事件
      if (callbacks.size === 0) {
        eventMap.delete(event);
      }
    },

    clear() {
      eventMap.clear();
    }
  };
};

// 导出全局事件总线实例（单例）
export const GloablEventBus = createEventBus();
