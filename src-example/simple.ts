import { Controller, FromBody, FromHeader, FromQuery, FromRoute, HttpDelete, HttpGet, HttpHead, HttpPatch, HttpPost, HttpPut, KoaRestful } from '@wangminghua/koa-restful'
import Koa, { Context } from 'koa'

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

// 创建 其他类型 请求控制器（仅支持类）, 路由参数、查询参数、请求头参数使用方法于GetController一致
@Controller()
class OtherController {
    // 返回一个字符串 /other/test1
    @HttpPost()
    test1(): string {
        return `GetController test1 = ${new Date().toLocaleTimeString()}`
    }
    // 返回修改过的TestModel /other/test2
    @HttpPost()
    test2(@FromBody({}) body: TestModel): TestModel {
        body.name += '-back'
        body.value += '-back'
        return body
    }

    // 一个方法同时支持多种类型的请求 /other/test3
    @HttpGet()
    @HttpPost()
    @HttpDelete()
    @HttpPatch()
    @HttpHead()
    @HttpPut()
    test3(): TestModel {
        return { name: 'n1', value: 'n2' }
    }

    // 获取上传的文件，需设置其 multipart = true
    @HttpPost()
    testFile(@FromBody({ multipart: true }) files) {
        console.log('files >>> ', files)
        return files
    }
}

// 创建 其他类型 请求控制器（仅支持类）, 路由参数、查询参数、请求头参数使用方法于GetController一致
// 指定控制器路由
@Controller('api/other')
class Other2Controller {
    // 返回一个字符串 /api/other/test1
    @HttpPost()
    test1(): string {
        return `Other2Controller test1 = ${new Date().toLocaleTimeString()}`
    }
    // 指定方法路由为 /api/other/t
    @HttpPost('t')
    test2(): string {
        return `Other2Controller test1 = ${new Date().toLocaleTimeString()}`
    }
}

const app = new Koa()
app.use(KoaRestful({ logs: true })) // 使用 KoaRestful 插件
app.listen(3000) // 创建 http://localhost:3000

console.log('启动成功，3秒后执行 restful api 请求。')
console.log('http://localhost:3000')
