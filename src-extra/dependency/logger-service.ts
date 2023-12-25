import { AddDependency, ConsoleLoggerService, LoggerService } from '@wangminghua/koa-restful'

/**
 * 添加控制台日志依赖
 * @returns
 */
export function AddConsoleLoggerService() {
    const cache = new ConsoleLoggerService()
    AddDependency(cache, { alias: [LoggerService] })
    return cache
}
