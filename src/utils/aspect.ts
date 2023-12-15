// declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void
// declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void
// declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void
// declare type ParameterDecorator = (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => void
import { Context } from 'koa'
import { KEY_AFTER_HOOK, KEY_BEFORE_HOOK, parsePropertyKey } from './shared'

export type Hook = (ctx: Context) => Promise<void>
/**
 * 切面选项
 */
type AspectOptions = {
    /**
     * 钩子类型
     */
    hookType: typeof KEY_BEFORE_HOOK | typeof KEY_AFTER_HOOK
}
/**
 * 切面函数
 */
export function Aspect(hook: Hook, options?: AspectOptions): MethodDecorator {
    const { hookType } = {
        hookType: KEY_BEFORE_HOOK,
        ...options,
    } as AspectOptions
    return function (target: Object, propertyKey: string | symbol): void {
        const metadataKey = `${hookType}${parsePropertyKey(propertyKey)}`
        if (!Reflect.hasMetadata(metadataKey, target.constructor)) {
            Reflect.defineMetadata(metadataKey, [], target.constructor)
        }
        const hooks = Reflect.getMetadata(metadataKey, target.constructor) as Array<Hook>
        hooks.push(hook)
    }
}
