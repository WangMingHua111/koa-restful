import { Authorize } from '@wangminghua/koa-restful'
import { AuthorizationSchemes } from './../utils/share'
export { AddCookieAuthentication, CookieAuthorization } from './cookie'
export { AddJwtBearerAuthentication, JwtBearerAuthorization } from './jwt-bearer'

/**
 * 授权认证
 * @param authenticationSchemes 身份认证方案，不输入值时取默认方式认证，否则使用指定的方案或方案集合认证
 * @returns
 * @description 请注意，如果输入的是认证方案集合，则集合中的任意方案均可通过认证后。
 */
export function SimpleAuthorize(authenticationSchemes?: AuthorizationSchemes | AuthorizationSchemes[]) {
    return Authorize(authenticationSchemes)
}
