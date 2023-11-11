/**
 * 对象缓存策略
 */
type ObjectCachingStrategy = {
  /**
   * 对象缓存策略的计时方式
   * ```
   * 'absolute' 绝对的，仅允许在有效期内获取对象缓存
   * 'sliding' 滑动的，有效期内，获取缓存，对象有效期将重新计时
   * ```
   * @default 'sliding'
   */
  type?: "absolute" | "sliding";
  /**
   * 过期时间间隔，单位（s）
   * @default 5 * 60
   */
  expired?: number;
};
/**
 * 缓存服务
 */
interface ICacheService {
  /**
   * 清理所有缓存
   */
  clear(): Promise<void>;
  /**
   * 删除指定缓存对象
   * @param key 缓存KEY
   */
  delete(key: string): Promise<boolean>;
  /**
   * 获取/创建缓存对象
   * @param key 缓存KEY
   * @param create 如果缓存对象不存在时，执行此函数创建缓存对象
   * @param cachingStrategy 对象缓存策略
   */
  get<T = any>(
    key: string,
    create?: () => Promise<T>,
    cachingStrategy?: ObjectCachingStrategy
  ): Promise<T | undefined>;
  /**
   * 缓存对象是否存在
   * @param key 缓存KEY
   */
  has(key: string): Promise<boolean>;
  /**
   * 设置新的缓存对象
   * @param key 缓存KEY
   * @param value 缓存数据
   * @param cachingStrategy 对象缓存策略
   */
  set<T = any>(
    key: string,
    value: T,
    cachingStrategy?: ObjectCachingStrategy
  ): Promise<void>;
  /**
   * 获取缓存Key数组
   */
  keys(): Promise<Array<string>>;
  /**
   * 获取缓存对象的数量
   */
  size(): Promise<number>;
  /**
   * 销毁对象，并清理资源
   */
  destroy(): void;
}
/**
 * 缓存服务的抽象实现类，用于属性的自动注入
 */
abstract class CacheService implements ICacheService {
  abstract clear(): Promise<void>;
  abstract delete(key: string): Promise<boolean>;
  abstract get<T = any>(
    key: string,
    create?: (() => Promise<T>) | undefined,
    cachingStrategy?: ObjectCachingStrategy | undefined
  ): Promise<T | undefined>;
  abstract has(key: string): Promise<boolean>;
  abstract set<T = any>(
    key: string,
    value: T,
    cachingStrategy?: ObjectCachingStrategy | undefined
  ): Promise<void>;
  abstract keys(): Promise<string[]>;
  abstract size(): Promise<number>;
  abstract destroy(): void;
}

/**
 * 缓存对象类型
 */
class ObjectCaching {
  private _type: "absolute" | "sliding";
  private _value: any;
  private _expired: number;
  private _expirationTime: Date;
  /**
   *
   * @param type 'absolute' | 'sliding'
   * @param expired 过期时间间隔，单位（s）
   */
  constructor(
    value: any,
    type: "absolute" | "sliding" = "sliding",
    expired: number = 5 * 60
  ) {
    this._value = value;
    this._type = type;
    this._expired = expired;
    this._expirationTime = this.calculateExpirationTime(new Date(), expired);
  }
  /**
   * 获取缓存对象的值
   * @returns
   */
  value() {
    // 如果对象缓存是滑动计算时间的话，重置过期时间
    if (this._type === "sliding") {
      this._expirationTime = this.calculateExpirationTime(
        this._expirationTime,
        this._expired
      );
    }
    return this._value;
  }
  /**
   * 检查对象是否有效
   */
  isValid() {
    // 当期时间，小于过期时间证明对象是有效的
    return new Date() < this._expirationTime;
  }

  private calculateExpirationTime(current: Date, seconds: number): Date {
    return new Date(current.getTime() + seconds * 1000);
  }
}
/**
 * 内存缓存服务配置项
 */
type MemoryCacheServiceOptions = {
  /**
   * 缓存对象扫描器执行间隔，移除过期的缓存对象，单位(s)
   * @default 60
   */
  scannerInterval?: number;
};
/**
 * 内存缓存服务
 */
class MemoryCacheService extends CacheService {
  private _cache: Record<string, ObjectCaching> = {};
  private _interval: any;
  constructor(options?: MemoryCacheServiceOptions) {
    super();
    const { scannerInterval = 60 } = {
      ...options,
    };
    // 创建定时器执行扫描器，移除失效的缓存对象
    this._interval = setInterval(this.scanner, scannerInterval * 1000);
  }
  destroy(): void {
    // 清理定时器
    clearInterval(this._interval);
    this._cache = {};
  }
  async clear(): Promise<void> {
    this._cache = {};
  }
  async delete(key: string): Promise<boolean> {
    delete this._cache[key];
    return true;
  }
  async get<T = any>(
    key: string,
    create?: (() => Promise<T>) | undefined,
    cachingStrategy?: ObjectCachingStrategy | undefined
  ): Promise<T | undefined> {
    let cache: ObjectCaching | undefined = this._cache[key];
    // 缓存对象已经过期
    if (cache && !cache.isValid()) {
      delete this._cache[key];
      cache = undefined;
    }
    // 缓存对象不存在，如果有create函数，创建缓存对象
    if (!cache && create) {
      const value = await create();
      const strategy: ObjectCachingStrategy = {
        type: "sliding",
        expired: 5 * 60,
        ...cachingStrategy,
      };
      this._cache[key] = cache = new ObjectCaching(
        value,
        strategy.type,
        strategy.expired
      );
    }
    return cache?.value();
  }
  async has(key: string): Promise<boolean> {
    return Reflect.has(this._cache, key);
  }
  async set<T = any>(
    key: string,
    value: T,
    cachingStrategy?: ObjectCachingStrategy | undefined
  ): Promise<void> {
    const strategy: ObjectCachingStrategy = {
      type: "sliding",
      expired: 5 * 60,
      ...cachingStrategy,
    };
    this._cache[key] = new ObjectCaching(
      value,
      strategy.type,
      strategy.expired
    );
  }
  async keys(): Promise<string[]> {
    return Object.keys(this._cache);
  }
  async size(): Promise<number> {
    return Object.keys(this._cache).length;
  }
  /**
   * 执行对象扫描器，移除过期的缓存对象
   */
  scanner() {
    if (this._cache === undefined) {
      clearInterval(this._interval);
      return;
    }
    const keys = Object.keys(this._cache);
    for (const key in keys) {
      const cache = this._cache[key];
      if (!cache?.isValid()) {
        delete this._cache[key];
      }
    }
  }
}

export { CacheService, ICacheService, MemoryCacheService };
