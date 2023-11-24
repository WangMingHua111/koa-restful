/**
 * 日志类型
 */
type LogType = 'info' | 'warn' | 'error' | 'debug'
/**
 * 日志服务(暂未实现)
 */
interface ILoggerService {
    /**
     * 断言日志输出
     * @param value 断言条件
     * @param message 日志内容
     * @param logType 日志类型
     */
    assert(value: boolean | Promise<boolean>, message: string, logType?: LogType): Promise<void>
    /**
     * 日志输出
     * @param message 日志内容
     * @param logType 日志类型
     */
    log(message: string, logType?: LogType): Promise<void>
    /**
     * debug 日志输出
     * @param message 日志内容
     */
    debug(message: string): Promise<void>
    /**
     * error 日志输出
     * @param message 日志内容
     */
    error(message: string): Promise<void>
    /**
     * info 日志输出
     * @param message 日志内容
     */
    info(message: string): Promise<void>
    /**
     * warn 日志输出
     * @param message 日志内容
     */
    warn(message: string): Promise<void>
}
/**
 * 日志服务抽象实现类，用于属性的自动注入
 */
abstract class LoggerService implements ILoggerService {
    async assert(value: boolean | Promise<boolean>, message: string, logType: LogType = 'info'): Promise<void> {
        let condition = false
        if (value instanceof Promise) {
            condition = await value
        } else {
            condition = value
        }
        if (condition) {
            await this.log(message, logType)
        }
    }
    abstract log(message: string, logType?: LogType | undefined): Promise<void>

    async debug(message: string): Promise<void> {
        await this.log(message, 'debug')
    }
    async error(message: string): Promise<void> {
        await this.log(message, 'error')
    }
    async info(message: string): Promise<void> {
        await this.log(message, 'info')
    }
    async warn(message: string): Promise<void> {
        await this.log(message, 'warn')
    }
}
/**
 * Console 日志服务
 */
class ConsoleLoggerService extends LoggerService {
    async log(message: string, logType?: LogType | undefined): Promise<void> {
        switch (logType) {
            case 'warn':
                console.warn(message)
                break
            case 'error':
                console.error(message)
                break
            case 'debug':
                console.debug(message)
                break
            case 'info':
            default:
                console.info(message)
                break
        }
    }
}

export { ConsoleLoggerService, ILoggerService, LoggerService }
