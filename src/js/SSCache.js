/* eslint-disable max-classes-per-file */
/**
 * 缓存服务
 */
class SSCacheProtrol {
  has(key) {
    //
  }

  get(key) {
    //
  }

  set(key, object) {
    //
  }

  remove(key) {
    //
  }

  clear() {
    //
  }
}

class SSMemboryCache extends SSCacheProtrol {
  /**
   * @type {Map}
   */
  _dataMap = null;

  destory() {
    this._dataMap?.clear();
    this._dataMap = null;
  }

  constructor() {
    super();
    this._dataMap = new Map();
  }

  has(key) {
    return this._dataMap.has[key];
  }

  get(key) {
    return this._dataMap.get(key);
  }

  set(key, object) {
    this._dataMap.set(key, object);
  }

  remove(key) {
    this._dataMap.delete(key);
  }

  clear() {
    this._dataMap.clear();
  }
}

class SSDiskCache extends SSCacheProtrol {
  has(key) {
    return !!localStorage.getItem(key);
  }

  get(key) {
    const json = localStorage.getItem(key);
    try {
      return JSON.parse(json);
    } catch (error) {
      return json;
    }
  }

  set(key, object) {
    if (typeof object === 'string') {
      localStorage.setItem(key, object);
    } else if (typeof object === 'object') {
      localStorage.setItem(key, JSON.stringify(object));
    } else if (typeof object === 'boolean' || typeof object === 'number') {
      localStorage.setItem(key, String(object));
    }
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}

class SSCache {
  /**
   * @type {SSMemboryCache}
   */
  memoryCache = null;

  /**
   * @type {SSDiskCache}
   */
  diskCache = null;

  /**
   * 缓存对象名称
   * @type {String}
   */
  name = null;

  constructor(name = '') {
    this.name = name;
    this.diskCache = new SSDiskCache();
    this.memoryCache = new SSMemboryCache();
  }

  destory() {
    this.name = null;
    this.diskCache = null;
    this.memoryCache.destory();
    this.memoryCache = null;
  }

  /**
   * 是否包含Key值
   * @param {*} key
   */
  has(key) {
    return this.memoryCache.has(key) || this.diskCache.has(key);
  }

  /**
 Returns the value associated with a given key.
 This method may blocks the calling thread until file read finished.

 @param key A string identifying the value. If nil, just return nil.
 @return The value associated with key, or nil if no value is associated with key.
 */
  get(key) {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    if (this.diskCache.has(key)) {
      return this.diskCache.get(key);
    }
  }

  /**
 Sets the value of the specified key in the cache.
 This method may blocks the calling thread until file write finished.

 @param  object The object to be stored in the cache. If nil, it calls `removeObjectForKey:`.
 @param {string} key    The key with which to associate the value. If nil, this method has no effect.
 @param {Boolean} persistent 持久话存储
 */
  set(key, object, persistent = false) {
    if (persistent) {
      this.diskCache.set(key, object);
    } else {
      this.memoryCache.set(key, object);
    }
  }

  /**
 Removes the value of the specified key in the cache.
 This method may blocks the calling thread until file delete finished.

 @param key The key identifying the value to be removed. If nil, this method has no effect.
 */
  remove(key) {
    if (this.memoryCache.has(key)) {
      this.memoryCache.remove(key);
      return;
    }
    if (this.diskCache.has(key)) {
      this.diskCache.remove(key);
    }
  }

  /**
 Empties the cache.
 This method may blocks the calling thread until file delete finished.
 */
  clear() {
    this.memoryCache.clear();
    this.diskCache.clear();
  }
}

export default new SSCache('shared');
