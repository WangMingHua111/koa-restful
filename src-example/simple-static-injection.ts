import { AddDependency, BaseController, Controller, HttpGet, Injection, KoaRestful } from '@wangminghua/koa-restful'
import axios, { type AxiosResponse } from 'axios'
import Koa from 'koa'

// 声明一个抽象类或者基类
abstract class BaseDataSet {
    abstract data(): string
}

class DataSet extends BaseDataSet {
    data() {
        return `${new Date().toISOString()}`
    }
}

class DataSet3 extends BaseDataSet {
    data() {
        return `${new Date().toISOString()}`
    }
}
// 静态创建一个依赖，并设置依赖别名类型为抽象类 BaseDataSet
AddDependency(new DataSet(), { alias: [BaseDataSet] })
AddDependency(new DataSet3(), { uniqueId: 'data-set' })

// let ds4: BaseDataSet;
// 创建一个控制器
@Controller()
class TestController extends BaseController {
    // 注入一个依赖
    @Injection()
    ds!: DataSet
    // 注入一个依赖
    @Injection()
    ds2!: BaseDataSet
    // 注入一个依赖
    @Injection({ uniqueId: 'data-set' })
    ds3!: BaseDataSet
    /**
     * 创建一个 get 请求
     */
    @HttpGet()
    GetNumber() {
        this.http.ok(`ds获取到：${this.ds.data()} ds2获取到：${this.ds2.data()} ds3获取到：${this.ds3.data()}`)
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
        console.log(`请求地址：${req.config.url}`, req.data)
    }
    axios(`${baseurl}/Test/GetNumber`).then(output)
}, 3000)
