import { Context, Next } from 'koa'
import { koaBody, type KoaBodyMiddlewareOptions } from 'koa-body'
import { KEY_PARAMETER, ParameterConverter, ParameterConverterFn, ParameterConverterType, TParam, parseParameterName, parsePropertyKey } from '../utils/shared'
import { BooleanArrayParameterConverter, BooleanParameterConverter, NumberArrayParameterConverter, NumberParameterConverter, StringArrayParameterConverter, StringParameterConverter } from './parameter-converter'

function readParams(params: any, p: TParam) {
    const name = typeof p === 'string' ? p : p.name
    const strictCase: boolean = typeof p === 'string' ? false : !!p.strictCase
    if (strictCase) return params[name]
    else {
        const propertyName = Object.keys(params).find((key) => key.toLowerCase() === name.toLowerCase())
        return propertyName ? params[propertyName] : undefined
    }
}

/**
 * bodyParser 参数
 * @link https://github.com/koajs/koa-body?tab=readme-ov-file#options
 */
export type BodyParserOptions = Partial<KoaBodyMiddlewareOptions> //Omit<Exclude<Parameters<typeof koaBody>[0], undefined>, 'encoding'> & { encoding?: string }

/**
 * 从查询参数中读取
 * @param name 参数名
 * @param converter
 * @returns
 */
export function FromQuery(name?: TParam, converter: ParameterConverterType = 'str'): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
        const parameterName = parseParameterName(target as any, propertyKey, parameterIndex)
        const metakey = `${KEY_PARAMETER}:${parsePropertyKey(propertyKey)}`
        const metadata: Record<number, ParameterConverterFn> = Reflect.getMetadata(metakey, target.constructor) || {}

        metadata[parameterIndex] = (ctx: Context) => {
            let conv: ParameterConverter
            switch (converter) {
                case 'strs':
                    conv = new StringArrayParameterConverter()
                    break
                case 'num':
                    conv = new NumberParameterConverter()
                    break
                case 'nums':
                    conv = new NumberArrayParameterConverter()
                    break
                case 'boolean':
                    conv = new BooleanParameterConverter()
                    break
                case 'booleans':
                    conv = new BooleanArrayParameterConverter()
                    break
                case 'str':
                    conv = new StringParameterConverter()
                    break
                default:
                    conv = converter
                    break
            }
            return conv.cast(readParams(ctx.query, name || parameterName))
        }
        Reflect.defineMetadata(metakey, metadata, target.constructor)
    }
}

/**
 * 从请求头参数中读取，示例：test?id=1
 * @param name 参数名
 * @param converter
 * @returns
 */

export function FromHeader(name?: TParam, converter: ParameterConverterType = 'str'): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
        const parameterName = parseParameterName(target as any, propertyKey, parameterIndex)
        const metakey = `${KEY_PARAMETER}:${parsePropertyKey(propertyKey)}`
        const metadata: Record<number, ParameterConverterFn> = Reflect.getMetadata(metakey, target.constructor) || {}

        metadata[parameterIndex] = (ctx: Context) => {
            let conv: ParameterConverter
            switch (converter) {
                case 'strs':
                    conv = new StringArrayParameterConverter()
                    break
                case 'num':
                    conv = new NumberParameterConverter()
                    break
                case 'nums':
                    conv = new NumberArrayParameterConverter()
                    break
                case 'boolean':
                    conv = new BooleanParameterConverter()
                    break
                case 'booleans':
                    conv = new BooleanArrayParameterConverter()
                    break
                case 'str':
                    conv = new StringParameterConverter()
                    break
                default:
                    conv = converter
                    break
            }
            const tname = typeof name === 'string' ? name : name?.name || parameterName
            return conv.cast(ctx.get(tname))
        }
        Reflect.defineMetadata(metakey, metadata, target.constructor)
    }
}

/**
 * 从路径参数中读取，示例：test/:id
 * @returns
 */
export function FromRoute(name?: TParam, converter: Extract<ParameterConverterType, 'str' | 'num'> = 'str'): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
        const parameterName = parseParameterName(target as any, propertyKey, parameterIndex)
        const metakey = `${KEY_PARAMETER}:${parsePropertyKey(propertyKey)}`
        const metadata: Record<number, ParameterConverterFn> = Reflect.getMetadata(metakey, target.constructor) || {}

        metadata[parameterIndex] = async (ctx: Context) => {
            let conv: ParameterConverter
            switch (converter) {
                case 'num':
                    conv = new NumberParameterConverter()
                    break
                case 'str':
                default:
                    conv = new StringParameterConverter()
                    break
            }
            return conv.cast(readParams(ctx.params, name || parameterName))
        }
        Reflect.defineMetadata(metakey, metadata, target.constructor)
    }
}

/**
 * 从body中读取
 * @param options 参数
 * @link https://github.com/koajs/bodyparser/tree/master#options
 * @returns
 */
export function FromBody(options?: BodyParserOptions): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
        // const parameterName = parseParameterName(target as any, propertyKey, parameterIndex)
        const metakey = `${KEY_PARAMETER}:${parsePropertyKey(propertyKey)}`
        const metadata: Record<number, ParameterConverterFn> = Reflect.getMetadata(metakey, target.constructor) || {}
        metadata[parameterIndex] = async (ctx: Context) => {
            const next: Next = async () => {}
            await koaBody(options as any)(ctx, next)
            await next() // 等待body读取完毕
            const { files, body } = ctx.request
            return files || body
        }
        Reflect.defineMetadata(metakey, metadata, target.constructor)
    }
}
