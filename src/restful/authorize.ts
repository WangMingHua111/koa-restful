import { Context } from 'koa'
import { Aspect } from '../utils/aspect'
import { isNullOrUndefined } from '../utils/shared'

const container = new Map<string, IAuthorization>()
/**
 * 认证方式
 */
export interface IAuthorization {
    /**
     * 钩子函数，执行身份认证
     * @param ctx koa Context
     */
    hook(ctx: Context): Promise<boolean>
}
/**
 * 授权认证
 * @param authenticationSchemes 身份认证方案，不输入值时取默认方式认证，否则使用指定的方案或方案集合认证
 * @returns
 * @description 请注意，如果输入的是认证方案集合，则集合中的任意方案均可通过认证后。
 */
export function Authorize(authenticationSchemes?: string | string[]): MethodDecorator {
    return Aspect(
        async (ctx: Context) => {
            if (container.size === 0) throw new Error('没有任何身份验证方案')

            // 没有指定身份认证方案，使用默认的方案进行认证
            let schemes: string[] = Array.isArray(authenticationSchemes) ? authenticationSchemes : isNullOrUndefined(authenticationSchemes) ? [[...container.keys()][0]] : [authenticationSchemes as string]
            // 遍历执行认证方案
            for (const scheme of schemes) {
                if (!container.has(scheme)) throw new Error(`无效的认证方案:${scheme}`)
                const { hook } = container.get(scheme) as IAuthorization
                const success = await hook(ctx)
                if (success) return // 身份认证通过
            }
            ctx.response.status = 401 // 所有身份认证方式均未通过
            return Promise.reject()
        },
        {
            hookType: '__BEFORE_HOOK__',
        }
    )
}

/**
 * 添加身份认证方案
 * @param authenticationScheme 身份认证方案名称
 * @param authorization 认证方式
 */
export function AddAuthentication(authenticationScheme: string, authorization: IAuthorization) {
    container.set(authenticationScheme, authorization)
}
