import { IScopeService, Lifecycle, SingletonScopeService, TransientScopeService } from '@wangminghua/di'
import { DefaultControllerOptions, KEY_ROUTE, KEY_ROUTE_PREFIX, isNullOrUndefined } from '../utils/shared'

export * from './from-type'
export * from './request-method'

// 控制器列表
const controllers = new Set<IScopeService>()

/**
 * 控制器选项
 */
export type ControllerOptions =
    | Lifecycle
    | {
          /**
           * 实例生命周期
           * @default 'transient'
           */
          lifecycle?: Lifecycle
          /**
           * 路由前缀，设置该选项时使用指定路由前缀，可以设置为空字符串''，代表移除路由前缀
           */
          prefix?: string
          /**
           * 控制器启用的
           * @default true
           */
          enabled?: boolean
      }

/**
 * 控制器（装饰器）
 * @param route
 * @param lifecycle 默认值：transient
 * @returns
 */
export function Controller(route?: string, lifecycle?: ControllerOptions): ClassDecorator {
    const temp: ControllerOptions = {
        lifecycle: DefaultControllerOptions.defaultLifecycle,
        prefix: undefined,
        enabled: true,
    }
    const options = Object.assign(temp, typeof lifecycle === 'string' ? { lifecycle } : typeof lifecycle === 'object' ? { ...lifecycle } : undefined)
    return function (target: Function) {
        Reflect.defineMetadata(KEY_ROUTE, route || target.name.replace(/Controller$/i, ''), target)
        if (!isNullOrUndefined(options.prefix)) {
            Reflect.defineMetadata(KEY_ROUTE_PREFIX, options.prefix, target)
        }
        let service: IScopeService
        switch (options.lifecycle) {
            case 'singleton':
                service = new SingletonScopeService(target)
                break
            case 'transient':
            default:
                service = new TransientScopeService(target)
                break
        }
        options.enabled && controllers.add(service)
    }
}

/**
 * 获取 Controller 控制器列表
 */
export function getControllers() {
    return controllers
}
