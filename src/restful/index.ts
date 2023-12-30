import { AddDependency, IScopeService, Lifecycle, ResolveDependencyFromUniqueId, SingletonScopeService, TransientScopeService } from '@wangminghua/di'
import { DefaultControllerOptions, KEY_ROUTE, KEY_ROUTE_PREFIX, isNullOrUndefined } from '../utils/shared'

export * from './authorize'
export * from './from-type'
export * from './request-method'

const uniqueId = '__koa_restful_controllers__'
// 控制器列表
AddDependency(new Set<IScopeService>(), { uniqueId })

/**
 * 获取 Controller 控制器列表
 */
export function getControllers() {
    const controllers = ResolveDependencyFromUniqueId(uniqueId) as Set<IScopeService>
    return controllers
}

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
           * ~~路由前缀，设置该选项时使用指定路由前缀，可以设置为空字符串''，代表移除路由前缀~~
           * @deprecated
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
        Reflect.defineMetadata(KEY_ROUTE, route ?? target.name.replace(/Controller$/i, ''), target)
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
        options.enabled && getControllers().add(service)
    }
}

/**
 * 路由前缀（装饰器）
 * @param prefix
 */
export function RoutePrefix(prefix: string): ClassDecorator {
    return function (target: Function) {
        Reflect.defineMetadata(KEY_ROUTE_PREFIX, prefix, target)
    }
}

/**
 * 用于手动添加控制器
 * @param target 控制器实例
 * @param route
 * @param lifecycle 默认值：transient
 */
export function AddController(target: Function, route?: string, lifecycle?: ControllerOptions) {
    Controller(route, lifecycle)(target)
}
