import { IScopeService, Lifecycle, SingletonScopeService, TransientScopeService } from '@wangminghua/di'
import { KEY_ROUTE } from '../utils/shared'

export * from './from-type'
export * from './request-method'

// 控制器列表
const controllers = new Set<IScopeService>()

/**
 * 控制器（装饰器）
 * @param route
 * @param lifecycle 默认值：transient
 * @returns
 */
export function Controller(route?: string, lifecycle: Lifecycle = 'transient'): ClassDecorator {
    return function (target: Function) {
        Reflect.defineMetadata(KEY_ROUTE, route || target.name.replace(/Controller$/i, ''), target)
        let service: IScopeService
        switch (lifecycle) {
            case 'singleton':
                service = new SingletonScopeService(target)
                break
            case 'transient':
            default:
                service = new TransientScopeService(target)
                break
        }
        controllers.add(service)
    }
}

/**
 * 获取 Controller 控制器列表
 */
export function getControllers() {
    return controllers
}
