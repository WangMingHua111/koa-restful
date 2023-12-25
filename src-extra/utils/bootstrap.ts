import { KoaRestful } from '@wangminghua/koa-restful'
import chalk from 'chalk'
import Koa from 'koa'

import { allIPs } from './share'

type Hooks = {
    beforeHook?: (koa: Koa) => void
    restfulHook?: (koa: Koa) => void
    afterHook?: (koa: Koa) => void
    listenHook?: (koa: Koa) => void
    allIPsHook?: (koa: Koa) => void
}

type BootstrapOptions = {
    /**
     * 显示日志
     * @default true
     */
    logs?: boolean
    /**
     * 显示wagger
     * @default true
     */
    swagger?: boolean
    /**
     * swagger 扫描目录
     * @default 'src'
     */
    swaggerDir?: string
}
/**
 * 引导器
 * @param port
 * @param hooks
 * @returns
 */
export function bootstrap(port: string | number = 3000, options?: BootstrapOptions, hooks?: Hooks): Koa {
    const {
        logs = true,
        swagger = true,
        swaggerDir = 'src',
    } = {
        ...options,
    } as BootstrapOptions
    const { beforeHook, afterHook, listenHook, allIPsHook, restfulHook } = {
        restfulHook: (koa) => {
            koa.use(KoaRestful({ logs }))
        },
        listenHook: (koa) => {
            koa.listen(port)
        },
        allIPsHook: () => {
            const ips = allIPs()
            if (ips.length > 0) {
                console.group(chalk.green('\n💥服务启动成功：'))
                for (const ip of ips) {
                    console.log(chalk.yellow(`http://${ip}:${port}`))
                }
                console.groupEnd()
            } else {
                console.log(chalk.red('当前系统的无有效的IP地址'))
                process.exit(1)
            }
        },
        ...hooks,
    } as Hooks
    const koa = new Koa()
    beforeHook?.(koa)
    restfulHook?.(koa)
    afterHook?.(koa)
    listenHook?.(koa)
    allIPsHook?.(koa)
    return koa
}
