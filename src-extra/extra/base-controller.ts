import { HttpError, getAuthorizations } from '@wangminghua/koa-restful'
import { Context } from 'koa'
import { ExtendedFormidableOptions, koaBody } from 'koa-body'
import { createReadStream, statSync } from 'node:fs'
/**
 * 基础控制器，提供一些比较常用的基础方法
 */
export abstract class BaseController {
    /**
     * Koa Context 原始对象
     */
    get ctx(): Context {
        return (this as any).__ctx
    }
    /**
     * 从认证方案中读取一个令牌
     * @returns
     */
    readToken(): string | undefined {
        const authorizations = getAuthorizations()
        for (const [, authorization] of authorizations) {
            const token = authorization.token(this.ctx)
            if (token) return token
        }
    }
    /**
     * 从认证方案中读取验证主体特征
     * @returns
     */
    async readClaims(): Promise<Record<string, string | number> | undefined> {
        const authorizations = getAuthorizations()
        for (const [, authorization] of authorizations) {
            const claims = await authorization.claims(this.ctx)
            if (claims) return claims
        }
    }
    /**
     * 抛出自定义 401 HttpError
     * @param message
     */
    bad(message: any = 'Bad Request') {
        throw new HttpError(message, 400)
    }
    /**
     * 抛出 403 HttpError
     * @param message
     */
    forbidden(message: any = 'Forbidden') {
        throw new HttpError(message, 403)
    }
    /**
     * 抛出 401 HttpError
     * @param message
     */
    unauthorized(message: any = 'Unauthorized') {
        throw new HttpError(message, 401)
    }
    /**
     * 抛出 自定义状态码 HttpError
     * @param status http状态码
     * @param message
     */
    custom(status: number, message: any = '') {
        throw new HttpError(message, status)
    }
    /**
     * 发送文件
     * @param filePath 文件路径
     */
    async sendFile(filePath: string): Promise<void> {
        const stats = await statSync(filePath)

        // 设置响应头，指定文件名和类型
        this.ctx.attachment(filePath)
        this.ctx.set('Content-Length', `${stats.size}`)

        // 通过流将文件发送给客户端
        const stream = createReadStream(filePath)

        this.ctx.body = stream // 设置响应主体为文件流
        this.ctx.status = 200 // 设置状态码为 200 OK
    }

    /**
     * 接收文件
     * @param formidable ExtendedFormidableOptions
     */
    async receiveFile(formidable?: ExtendedFormidableOptions) {
        const next = async () => {}
        await koaBody({ multipart: true, formidable })(this.ctx, next)
        await next()
        return this.ctx.request.files
    }
}
