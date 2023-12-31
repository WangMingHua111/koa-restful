import { AddDependency, ResolveDependencyFromUniqueId } from '@wangminghua/di'
import { Context } from 'koa'
import { Aspect } from '../utils/aspect'
import { isNullOrUndefined } from '../utils/shared'

const uniqueId = '__koa_authorize_container__'

AddDependency(new Map<string, IAuthorization>(), { uniqueId })

/**
 * 获取身份认证方案map
 * @returns
 */
export function getAuthorizations() {
    return ResolveDependencyFromUniqueId(uniqueId) as Map<string, IAuthorization>
}

/**
 * 认证方式
 */
export interface IAuthorization {
    /**
     * 钩子函数，执行身份认证
     * @param ctx koa Context
     */
    hook(ctx: Context): Promise<boolean>
    /**
     * 读取用户设置的令牌
     * @param ctx koa Context
     */
    token(ctx: Context): string | undefined
    /**
     * 读取验证主体特征
     * @param ctx
     */
    claims(ctx: Context): Promise<Record<string, string | number> | undefined>
}
/**
 * 授权认证
 * @param authenticationSchemes 身份认证方案，不输入值时取默认方式认证，否则使用指定的方案或方案集合认证
 * @returns
 * @description 请注意，如果输入的是认证方案集合，则集合中的任意方案均可通过认证后。
 */
export function Authorize(authenticationSchemes?: string | string[]): ClassDecorator & MethodDecorator {
    return Aspect(
        async (ctx: Context) => {
            const container = getAuthorizations()
            if (container.size === 0) throw new Error('没有任何身份验证方案')

            // 没有指定身份认证方案，使用默认的方案进行认证
            let schemes: string[] = Array.isArray(authenticationSchemes) ? authenticationSchemes : isNullOrUndefined(authenticationSchemes) ? [[...container.keys()][0]] : [authenticationSchemes as string]
            // 遍历执行认证方案
            for (const scheme of schemes) {
                if (!container.has(scheme)) throw new Error(`无效的认证方案:${scheme}`)
                const authorization = container.get(scheme) as IAuthorization
                const success = await authorization.hook.bind(authorization)(ctx)
                if (success) return // 身份认证通过
            }
            ctx.response.status = 401 // 所有身份认证方式均未通过
            return Promise.reject()
        },
        {
            hookType: 'beforeHook',
        }
    )
}

/**
 * 添加身份认证方案
 * @param authenticationScheme 身份认证方案名称
 * @param authorization 认证方式
 */
export function AddAuthentication<TAuthorization extends IAuthorization>(authenticationScheme: string, authorization: TAuthorization) {
    const container = getAuthorizations()
    container.set(authenticationScheme, authorization)
    return authorization
}
