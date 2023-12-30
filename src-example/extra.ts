import { AddGlobalHook, Aspect, Authorize, Controller, FromHeader, FromQuery, FromRoute, HttpGet } from '@wangminghua/koa-restful'
import { AddCookieAuthentication, AddSwaggerUI, bootstrap } from '@wangminghua/koa-restful/extra'
import { Context } from 'koa'

AddGlobalHook(
    async () => {
        console.log('__GLOBAL_BEFORE_HOOK__')
    },
    {
        hookType: 'globalBeforeHook',
    }
)

AddGlobalHook(
    async (ctx) => {
        console.log('__GLOBAL_AFTER_HOOK__', ctx.body)
    },
    {
        hookType: 'globalAfterHook',
    }
)

// 测试类型
type TestModel = { name: string; value: string }

/**
 * 创建 GET 请求控制器（仅支持类）
 */
@Controller()
class GetController {
    /**
     * 返回一个字符串
     * @returns
     */
    @Aspect(async (ctx) => {
        console.log('前置钩子 Aspect>>>', `${Date.now()} ${ctx.URL}`)
    })
    @Aspect(
        async (ctx) => {
            console.log('后置钩子 Aspect>>>', `${Date.now()} ${ctx.URL}`)
        },
        {
            hookType: 'afterHook',
        }
    )
    @HttpGet()
    test1(): string {
        return `GetController test1 = ${new Date().toLocaleTimeString()}`
    }

    // 获取查询参数
    @HttpGet()
    test2(@FromQuery() name: string): string {
        return `GetController test2 = ${new Date().toLocaleTimeString()} name = ${name}`
    }

    // 获取路径参数
    @HttpGet('test3/:id')
    test3(@FromRoute() id: string): string {
        return `GetController test3 = ${new Date().toLocaleTimeString()} id = ${id}`
    }

    // 读取路径参数和查询参数
    @HttpGet('test4/:id')
    test4(@FromRoute() id: string, @FromQuery() name: string): string {
        return `GetController test4 = ${new Date().toLocaleTimeString()} id = ${id} name = ${name}`
    }

    // 第一个参数默认为Koa Context
    @HttpGet('test5/:id')
    test5(ctx: Context, @FromRoute() id: string, @FromQuery() name: string): string {
        return `GetController test5 = ${new Date().toLocaleTimeString()} id = ${id} name = ${name} ip = ${ctx.request.ip}`
    }

    // 方法参数名称不匹配时，指定从固定参数读取
    @HttpGet('test6/:id')
    test6(@FromRoute('id') id2: string): string {
        return `GetController test6 = ${new Date().toLocaleTimeString()} id = ${id2}`
    }

    // 从请求头读取token参数
    @HttpGet()
    test7(@FromHeader() token: string): string {
        return `GetController test7 = ${new Date().toLocaleTimeString()} token = ${token}`
    }
    // 强制路由转换 为 test8-2
    @HttpGet('test8-2')
    test8(): string {
        return `GetController test8 = ${new Date().toLocaleTimeString()}`
    }
}

/**
 * 此控制器需要身份认证后访问
 */
@Authorize()
@Controller()
class AuthorizeController {
    @HttpGet()
    test1(): string {
        return `GetController test1 = ${new Date().toLocaleTimeString()}`
    }

    // 获取查询参数
    @HttpGet()
    test2(@FromQuery() name: string): string {
        return `GetController test2 = ${new Date().toLocaleTimeString()} name = ${name}`
    }
}

AddSwaggerUI('src-example/extra.ts')
AddCookieAuthentication({
    secret: '12314asd45wqe',
})

bootstrap(3000)
