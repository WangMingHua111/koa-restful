import { Controller, FromQuery, FromRoute, HttpGet, KoaRestful } from '@wangminghua/koa-restful'
import { type AxiosResponse } from 'axios'
import Koa, { Context } from 'koa'

// 创建一个控制器
@Controller()
class TestController {
    /**
     * 创建一个 get/post/delete/put 请求
     */
    @HttpGet()
    GetTest(): void {
        throw new Error('哈哈哈')
        // return {
        //     a: `获取到：${2}`,
        //     b: 1,
        // }
    }

    // 创建一个请求，并读取url查询参数，和路径查询参数
    @HttpGet('GetTestParameter/:id')
    GetTestParameter(ctx: Context, @FromRoute() id: string, @FromQuery() name: string = '123') {
        return `路径参数ID = ${id} 查询参数NAME = ${name} ${ctx.ip}`
    }
}

const app = new Koa()
app.use(KoaRestful({ logs: true })) // 使用 KoaRestful 插件
app.listen(3000) // 创建 http://localhost:3000

console.log('启动成功，3秒后执行 restful api 请求。')
console.log('http://localhost:3000')

// 3秒后启动测试脚本
setTimeout(() => {
    const baseurl = `http://localhost:3000`
    const output = async (req: AxiosResponse) => {
        console.log(`${req.config.method} 请求地址：${req.config.url}`, req.data)
    }
    // axios.get(`${baseurl}/Test/GetTest`).then(output)
    // axios.post(`${baseurl}/Test/GetTest`).then(output)
    // axios.put(`${baseurl}/Test/GetTest`).then(output)
    // axios.delete(`${baseurl}/Test/GetTest`).then(output)

    // axios.get(`${baseurl}/Test/GetTestParameter/123`, { params: { name: 'hyi' } }).then(output)
}, 3000)
