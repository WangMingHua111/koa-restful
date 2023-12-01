import 'reflect-metadata'
import { KEY_METHOD, RecordMethods, parsePropertyKey } from '../utils/shared'

const parseRecordMethods = (target: Object): RecordMethods => {
    if (!Reflect.hasMetadata(KEY_METHOD, target.constructor)) {
        const methods: RecordMethods = {
            delete: [],
            get: [],
            head: [],
            options: [],
            post: [],
            put: [],
            patch: [],
        }
        Reflect.defineMetadata(KEY_METHOD, methods, target.constructor)
    }
    return Reflect.getMetadata(KEY_METHOD, target.constructor)
}

export function HttpGet(route?: string): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol): void {
        parseRecordMethods(target).get.push({
            route,
            propertyKey: parsePropertyKey(propertyKey),
        })
    }
}
export function HttpHead(route?: string): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol): void {
        parseRecordMethods(target).head.push({
            route,
            propertyKey: parsePropertyKey(propertyKey),
        })
    }
}
export function HttpOptions(route?: string): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol): void {
        parseRecordMethods(target).options.push({
            route,
            propertyKey: parsePropertyKey(propertyKey),
        })
    }
}
export function HttpPost(route?: string): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol): void {
        parseRecordMethods(target).post.push({
            route,
            propertyKey: parsePropertyKey(propertyKey),
        })
    }
}
export function HttpPut(route?: string): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol): void {
        parseRecordMethods(target).put.push({
            route,
            propertyKey: parsePropertyKey(propertyKey),
        })
    }
}
export function HttpPatch(route?: string): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol): void {
        parseRecordMethods(target).patch.push({
            route,
            propertyKey: parsePropertyKey(propertyKey),
        })
    }
}
/**
 * http delete
 * @param route 指定路由地址
 * @returns
 */
export function HttpDelete(route?: string): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol): void {
        parseRecordMethods(target).delete.push({
            route,
            propertyKey: parsePropertyKey(propertyKey),
        })
    }
}
