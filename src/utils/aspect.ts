// declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void
// declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void
// declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void
// declare type ParameterDecorator = (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => void
import { Hook, HookType, KEY_AFTER_HOOK, KEY_BEFORE_HOOK, parsePropertyKey } from './shared'
/**
 * 切面选项
 */
type AspectOptions = {
    /**
     * 钩子类型
     */
    hookType: Extract<HookType, 'beforeHook' | 'afterHook'>
    /**
     * 定义元数据
     * @param target
     * @param propertyKey
     * @returns
     */
    metadataHook?: (target: Object | Function, propertyKey: string | symbol) => void
}
/**
 * 切面函数
 */
export function Aspect(hook: Hook, options?: AspectOptions): ClassDecorator & MethodDecorator {
    const { hookType, metadataHook } = {
        hookType: 'beforeHook',
        ...options,
    } as AspectOptions

    let hookTypeKey: typeof KEY_BEFORE_HOOK | typeof KEY_AFTER_HOOK
    switch (hookType) {
        case 'afterHook':
            hookTypeKey = '__AFTER_HOOK__'
            break
        default:
            hookTypeKey = '__BEFORE_HOOK__'
            break
    }

    return function (target: Object | Function, propertyKey: string | symbol = '*'): void {
        // 用于定义元数据
        metadataHook?.(target, propertyKey)

        const metadataKey = `${hookTypeKey}${parsePropertyKey(propertyKey)}`
        // function 代表装饰器是一个ClassDecorator
        const cls = typeof target === 'function' ? target : target.constructor

        if (!Reflect.hasMetadata(metadataKey, cls)) {
            Reflect.defineMetadata(metadataKey, [], cls)
        }
        const hooks = Reflect.getMetadata(metadataKey, cls) as Array<Hook>
        hooks.push(hook)
    }
}
