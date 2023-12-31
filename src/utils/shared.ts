import { Lifecycle } from '@wangminghua/di'
import { Context, Next } from 'koa'

/**
 * Global Before Hook KEY
 */
export const KEY_GLOBAL_BEFORE_HOOK = '__GLOBAL_BEFORE_HOOK__'
/**
 * Global After Hook KEY
 */
export const KEY_GLOBAL_AFTER_HOOK = '__GLOBAL_AFTER_HOOK__'

/**
 * Before Hook KEY
 */
export const KEY_BEFORE_HOOK = '__BEFORE_HOOK__'
/**
 * After Hook KEY
 */
export const KEY_AFTER_HOOK = '__AFTER_HOOK__'
/**
 * Route KEY
 */
export const KEY_ROUTE = '__ROUTE__'
/**
 * Route Prefix KEY
 */
export const KEY_ROUTE_PREFIX = '__ROUTE_PREFIX__'
/**
 * Method KEY
 */
export const KEY_METHOD = '__METHOD__'
/**
 * Parameter KEY
 */
export const KEY_PARAMETER = '__PARAMETER__'

/**
 * 控制器默认配置项
 */
export const DefaultControllerOptions: {
    /**
     * 默认控制器生命周期
     * @default 'transient'
     */
    defaultLifecycle: Lifecycle
    /**
     * 默认路由前缀，当控制器设置了 prefix 后会覆盖该选项
     * @default '/api'
     */
    defaultRoutePrefix: string
} = {
    defaultLifecycle: 'transient',
    defaultRoutePrefix: '/api',
}

/**
 * 将对象转换为koa传输字符串数据
 * @param obj
 * @returns
 */
export function tobj(obj: Object) {
    return JSON.stringify(obj).replace(/"\@func([\w\W]+?)&\$"/g, '$1')
}
/**
 * 将一个函数转换为字符串，支持通过tobj转换的对象在html script中进行函数的反序列化，
 * 禁止在内部编写注释。
 * @param fn
 * @returns
 */
export function tfunc<T extends Function>(fn: T): T {
    let t: any = `@func${fn.toString()}&$`.replace(/\r\n/g, '')
    return t
}
/**
 * 路径合成
 * @param args
 * @returns
 */
export function join(...args: string[]): string {
    return args
        .filter((str) => str)
        .map((str) => (str.startsWith('/') ? str : '/' + str))
        .join('')
}
/**
 * isNullOrUndefined
 * @param route
 * @returns
 */
export function isNullOrUndefined(route: string | undefined | null) {
    return route === undefined || route === null
}

/**
 * **Hook函数，执行顺序为：全局前置钩子 > 前置钩子 > 后置钩子 > 全局后置钩子**
 */
export type Hook = (ctx: Context) => Promise<void>

/**
 * **Hook类型，执行顺序为：全局前置钩子 > 前置钩子 > 后置钩子 > 全局后置钩子**
 *
 * 前置钩子=beforeHook
 *
 * 后置钩子=afterHook
 *
 * 全局前置钩子=globalBeforeHook
 *
 * 全局后置钩子=globalAfterHook
 */
export type HookType = 'beforeHook' | 'afterHook' | 'globalBeforeHook' | 'globalAfterHook'

/**
 * 参数
 */
export type TParam =
    | string
    | {
          /**
           * 参数名
           */
          name: string
          /**
           * 参数名严格大小写
           */
          strictCase?: boolean
      }

/**
 * 请求方法
 */
export type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'options' | 'head' | 'delete'

/**
 * 记录类型
 */
export type RecordMethods = {
    [key in RequestMethod]: Array<{ route?: string; propertyKey: string }>
}

/**
 * 参数转换器
 */
export abstract class ParameterConverter {
    abstract cast(value: string | string[] | undefined): any
}

export type ParameterConverterFn = (ctx: Context, next: Next) => Promise<any> | any
/**
 * 参数转换类型
 */
export type ParameterConverterType = ParameterConverter | 'str' | 'strs' | 'num' | 'nums' | 'boolean' | 'booleans'

/**
 * 请求错误
 */
export class HttpError extends Error {
    /**
     * 错误状态吗
     */
    status: number
    /**
     * HttpError
     * @param message 错误消息
     * @param status 状态码，默认值400
     */
    constructor(message: string | any, status: number = 400) {
        super()
        this.message = message
        this.status = status
    }
}
/**
 * 解析属性名
 * @param propertyKey
 */
export function parsePropertyKey(propertyKey: string | symbol | undefined): string {
    const property = typeof propertyKey === 'string' ? propertyKey : (propertyKey as any).name
    return property
}

/**
 * 解析方法参数名
 * @param target
 * @param propertyKey 方法名
 * @param parameterIndex 参数索引
 * @returns
 */
export function parseParameterName(target: { [name in string]: Function }, propertyKey: string | symbol | undefined, parameterIndex: number): string {
    const method = parsePropertyKey(propertyKey)
    const names = getParameterNames(target[method])
    return names[parameterIndex]
}

/**
 * 通过Function toString解析参数列表
 * @param func
 * @returns
 */
function getParameterNames(func: Function) {
    const functionAsString = func.toString()
    // 通过正则表达式匹配函数参数
    const parameterNames = functionAsString.slice(functionAsString.indexOf('(') + 1, functionAsString.indexOf(')')).match(/([^\s,]+)/g)
    return parameterNames || []
}
