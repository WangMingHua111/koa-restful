import { AddAuthentication, AddDependency, IAuthorization } from '@wangminghua/koa-restful'
import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken'
import { Context } from 'koa'
import { OpenAPIV3 } from 'openapi-types'

import { AddSecurityScheme } from '../utils/security-scheme'
import { AuthorizationSchemes } from '../utils/share'

/**
 * CookieAuthorizationOptions
 */
type CookieAuthorizationOptions = {
    /**
     * 鉴权头
     * @default 'x-accese-token'
     */
    authorityHeader?: string
    /**
     * secret
     */
    secret: string
    /**
     * 以秒或描述时间跨度的字符串vercel/ms表示。
     * @default '7d'
     * @example
     * 例如:60，“2天”，“10h”，“7d”。数值被解释为秒数。如果使用字符串，请确保提供时间单位(天、小时等)，否则默认使用毫秒单位("120"等于"120ms")。
     */
    expiresIn?: number | string
    /**
     * 签名选项
     */
    signOptions?: Omit<SignOptions, 'expiresIn'>
    /**
     * 验证jwt的选项
     */
    verifyOptions?: VerifyOptions
}

/**
 * Cookie 身份认证方法
 */
export class CookieAuthorization implements IAuthorization {
    public static readonly scheme: AuthorizationSchemes = 'Cookie'
    options: CookieAuthorizationOptions & { authorityHeader: string }
    constructor(options: CookieAuthorizationOptions) {
        this.options = {
            authorityHeader: 'x-accese-token',
            ...options,
        }
    }
    /**
     * authorityHeader
     */
    get authorityHeader(): string {
        return this.options.authorityHeader
    }
    /**
     * SecuritySchemeObject
     */
    get securitySchemeObject(): OpenAPIV3.SecuritySchemeObject {
        return {
            type: 'apiKey',
            in: 'cookie',
            name: this.options.authorityHeader,
        }
    }
    async hook(ctx: Context): Promise<boolean> {
        const { authorityHeader } = this.options
        const token = ctx.cookies.get(authorityHeader)
        if (!token) return false
        try {
            this.verify(token)
            return true
        } catch (err) {
            return false
        }
    }
    verify(token: string) {
        const { secret, verifyOptions } = this.options
        jwt.verify(token, secret, { ...verifyOptions })
    }
    /**
     * jwt
     * @param payload
     * @param secret
     * @param expiresIn
     */
    sign(payload: JwtPayload): string {
        const { secret, expiresIn = '7d', signOptions } = this.options
        return jwt.sign(payload, secret, { expiresIn, ...signOptions })
    }
}
/**
 * 添加 Cookie 身份认证方案
 */
export function AddCookieAuthentication(options: CookieAuthorizationOptions | (() => CookieAuthorizationOptions)) {
    const opts = typeof options === 'function' ? options() : options
    const authorization = new CookieAuthorization(opts)
    AddSecurityScheme(CookieAuthorization.scheme, authorization.securitySchemeObject)
    AddDependency(authorization)
    return AddAuthentication(CookieAuthorization.scheme, authorization)
}
