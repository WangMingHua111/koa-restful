import { Context, Next } from "koa";

export const KEY_CONTROLLER = "api:controller";
export const KEY_METHOD = "api:method";
export const KEY_PARAMETER = "api:parameter";

/**
 * 依赖生命周期
 */
export type Lifecycle = "transient" | "singleton";

/**
 * 作用域服务
 */
export interface IScopeService {
  /**
   * class prototype
   */
  readonly cls: Function;
  /**
   * 返回对象实例
   */
  instance(): any;
}

/**
 * 瞬态实例服务
 */
export class TransientScopeService implements IScopeService {
  cls: Function;
  constructor(cls: Function) {
    this.cls = cls;
  }
  instance() {
    return Reflect.construct(this.cls, []);
  }
}

/**
 * 单例服务
 */
export class SingletonScopeService implements IScopeService {
  cls: Function;
  ins: any;
  constructor(cls: Function, immediate = false) {
    this.cls = cls;
    // 立即生成实例
    if (immediate) this.instance();
  }
  instance() {
    if (!this.ins) this.ins = Reflect.construct(this.cls, []);
    return this.ins;
  }
}

/**
 * 参数
 */
export type TParam =
  | string
  | {
      /**
       * 参数名
       */
      name: string;
      /**
       * 参数名严格大小写
       */
      strictCase?: boolean;
    };

/**
 * 请求方法
 */
export type RequestMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "options"
  | "head"
  | "delete";

/**
 * 记录类型
 */
export type RecordMethods = {
  [key in RequestMethod]: Array<{ route?: string; propertyKey: string }>;
};

/**
 * 参数转换器
 */
export abstract class ParameterConverter {
  abstract cast(value: string | string[] | undefined): any;
}

export type ParameterConverterFn = (
  ctx: Context,
  next: Next
) => Promise<any> | any;
/**
 * 参数转换类型
 */
export type ParameterConverterType =
  | ParameterConverter
  | "str"
  | "strs"
  | "num"
  | "nums"
  | "boolean"
  | "booleans";

/**
 * 内部的Http便捷方法
 */
export class InnerHttp {
  public ctx: Context;
  constructor(ctx: Context) {
    this.ctx = ctx;
  }
  public ok(data?: any): void {
    this.ctx.response.status = 200;
    this.ctx.response.body = data;
  }
  public bad(data?: any): void {
    this.custom(400, data);
  }
  public unauthorized(data?: any) {
    this.custom(401, data);
  }
  public forbidden(data?: any) {
    this.custom(403, data);
  }
  public custom(status: number, data?: any) {
    this.ctx.response.status = status;
    if (data !== undefined) this.ctx.response.body = data;
  }
  // todo 401 403 500 等
}
/**
 * 解析属性名
 * @param propertyKey
 */
export function parsePropertyKey(
  propertyKey: string | symbol | undefined
): string {
  const property =
    typeof propertyKey === "string" ? propertyKey : (propertyKey as any).name;
  return property;
}
