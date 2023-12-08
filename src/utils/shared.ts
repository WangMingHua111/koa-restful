import { Context, Next } from 'koa'

export const KEY_CONTROLLER = 'api:controller'
export const KEY_METHOD = 'api:method'
export const KEY_PARAMETER = 'api:parameter'
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
    constructor(message: string, status: number = 400) {
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
