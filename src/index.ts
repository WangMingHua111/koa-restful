import Router from '@koa/router'
import { Context, Next } from 'koa'
import compose from 'koa-compose'
import 'reflect-metadata'
import { getControllers } from './restful'
import { InnerHttp, KEY_CONTROLLER, KEY_METHOD, KEY_PARAMETER, ParameterConverterFn, RecordMethods, RequestMethod } from './shared'

export * from './di'
export * from './restful'
export * from './services'

type KoaRestfulOptions = {
    /**
     * 开启日志
     */
    logs?: boolean
}

/**
 * BaseController
 */
export abstract class BaseController {
    private _http!: InnerHttp

    get http() {
        return this._http
    }
}
const router = new Router()
/**
 * Koa 中间件
 * @param this
 * @param ctx
 * @param next
 */
export function KoaRestful(options?: KoaRestfulOptions) {
    const opts: KoaRestfulOptions = {
        logs: false,
        ...options,
    }
    const join = (...args: string[]): string => {
        return args
            .filter((str) => str)
            .map((str) => (str.startsWith('/') ? str : '/' + str))
            .join('')
    }
    const isNullOrUndefined = (route: string | undefined | null) => {
        return route === undefined || route === null
    }
    const log = opts.logs ? console.log : undefined

    const controllers = getControllers()

    for (const controller of controllers) {
        const prefix = Reflect.getMetadata(KEY_CONTROLLER, controller.cls)
        const methods: RecordMethods = Reflect.getMetadata(KEY_METHOD, controller.cls)
        for (const property in methods) {
            const key = property as RequestMethod
            const arr = methods[key]
            arr.forEach(({ route, propertyKey }) => {
                const parameters: Record<number, ParameterConverterFn> = Reflect.getMetadata(`${KEY_PARAMETER}:${propertyKey}`, controller.cls) || {}
                const path = join(prefix, isNullOrUndefined(route) ? propertyKey : (route as string))
                log?.(`${property} ${path}`)
                router[property as RequestMethod](join(path), async (ctx: Context, next: Next) => {
                    // 获取控制器示例
                    const instance = controller.instance()
                    // 获取控制器方法
                    const fn = instance[propertyKey] as Function | undefined
                    // 设置默认参数
                    const args = [ctx, next]
                    for (const key of Object.keys(parameters)) {
                        const index = Number(key)
                        let value
                        // @ts-ignore
                        const result = parameters[key](ctx, next)
                        if (result instanceof Promise) {
                            value = await result
                        } else {
                            value = result
                        }
                        args.splice(index, 1, value)
                    }
                    // 尽量使用瞬态实例，避免上下文混乱
                    if (instance instanceof BaseController) {
                        Object.assign(instance, { _http: new InnerHttp(ctx) })
                    }
                    // 调用，通过bind设置上下文
                    return fn?.apply(instance, args)
                })
            })
        }
    }
    const routers = router.routes()
    const allowedMethods = router.allowedMethods()
    const dispatch = (ctx: any, next: Next) => {
        // debugger
        return compose([routers, allowedMethods])(ctx, next)
    }
    return dispatch
}

export default KoaRestful
