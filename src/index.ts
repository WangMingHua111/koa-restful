import 'reflect-metadata'

import Router from '@koa/router'
import { Context, HttpError as KoaHttpError, Next } from 'koa'
import compose from 'koa-compose'

import { getControllers } from './restful'
import { DefaultControllerOptions, HttpError, KEY_METHOD, KEY_PARAMETER, KEY_ROUTE, KEY_ROUTE_PREFIX, ParameterConverterFn, RecordMethods, RequestMethod, isNullOrUndefined, join } from './utils/shared'

export * from '@wangminghua/di'
export * from './openapi'
export * from './restful'
export * from './services/cache-service'
export * from './services/logger-service'
export { DefaultControllerOptions, HttpError, isNullOrUndefined, join } from './utils/shared'

type KoaRestfulOptions = {
    /**
     * 开启日志
     */
    logs?: boolean
}

/**
 * 延迟处理化控制器
 * @param options
 * @returns
 */
async function delayInit(options?: KoaRestfulOptions) {
    const router = new Router()
    const opts: KoaRestfulOptions = {
        logs: false,
        ...options,
    }
    const log = opts.logs ? console.log : undefined

    const controllers = getControllers()

    for (const controller of controllers) {
        const defaultRoutePrefix = DefaultControllerOptions.defaultRoutePrefix
        const controllerRoute = Reflect.getMetadata(KEY_ROUTE, controller.cls)
        const controllerRoutePrefix = Reflect.getMetadata(KEY_ROUTE_PREFIX, controller.cls)
        const methods: RecordMethods = Reflect.getMetadata(KEY_METHOD, controller.cls)
        for (const property in methods) {
            const key = property as RequestMethod
            const arr = methods[key]
            arr.forEach(({ route, propertyKey }) => {
                const parameters: Record<number, ParameterConverterFn> = Reflect.getMetadata(`${KEY_PARAMETER}:${propertyKey}`, controller.cls) || {}
                const path = join(controllerRoutePrefix ?? defaultRoutePrefix, controllerRoute, isNullOrUndefined(route) ? propertyKey : (route as string))

                log?.(`${property} ${path}`)
                router[property as RequestMethod](join(path), async (ctx: Context, next: Next) => {
                    // 获取控制器示例
                    const instance = controller.instance()
                    // 获取控制器方法
                    const fn = instance[propertyKey] as Function | undefined
                    // 设置默认参数
                    const args = [ctx, next]
                    //#region 控制器方法入参自动解析
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
                    //#endregion
                    try {
                        // 调用控制器方法，通过bind设置上下文
                        const fnResult = fn?.apply(instance, args)
                        const data = fnResult instanceof Promise ? await fnResult : fnResult
                        ctx.response.status = 200
                        ctx.response.body = data
                        await next()
                    } catch (e: any) {
                        if (e instanceof HttpError) {
                            ctx.response.status = e.status
                            ctx.response.body = e.message
                        } else if (e instanceof KoaHttpError) {
                            ctx.response.status = e.status
                            ctx.response.body = e.message
                        } else if (e instanceof Error) {
                            ctx.response.status = 400
                            ctx.response.body = e.message
                        }
                    }
                })
            })
        }
    }
    const routers = router.routes()
    const allowedMethods = router.allowedMethods()
    return [routers, allowedMethods]
}

/**
 * Koa 中间件
 * @param this
 * @param ctx
 * @param next
 */
export function KoaRestful(options?: KoaRestfulOptions) {
    let ready: ReturnType<typeof delayInit>
    const dispatch = async (ctx: any, next: Next) => {
        if (ready === undefined) ready = delayInit(options)
        const [routers, allowedMethods] = await ready
        return compose([routers, allowedMethods])(ctx, next)
    }
    return dispatch
}

export default KoaRestful
