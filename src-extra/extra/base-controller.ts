import { HttpError } from '@wangminghua/koa-restful'
import { Context } from 'koa'
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
     * 抛出自定义 401 HttpError
     * @param message
     */
    bad(message?: any) {
        throw new HttpError(message, 400)
    }
    /**
     * 抛出 403 HttpError
     * @param message
     */
    forbidden(message?: any) {
        throw new HttpError(message, 403)
    }
    /**
     * 抛出 401 HttpError
     * @param message
     */
    unauthorized(message?: any) {
        throw new HttpError(message, 401)
    }
    /**
     * 抛出 自定义状态码 HttpError
     * @param status http状态码
     * @param message
     */
    custom(status: number, message?: any) {
        throw new HttpError(message, status)
    }
    /**
     * 发送文件（暂未实现）
     * @param file
     */
    async sendFile(file: string | File | Buffer) {
        throw new Error('方法未实现')
    }

    /**
     * 接收文件（暂未实现）
     * @param file
     */
    async receiveFile(): Promise<string | File | Buffer> {
        throw new Error('方法未实现')
    }
}
