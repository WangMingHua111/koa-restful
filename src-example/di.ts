import { Controller, Dependency, HttpGet, Injection, KoaRestful, ResolveDependency, ResolveDependencyFromUniqueId } from '@wangminghua/koa-restful'
import Koa from 'koa'

interface IDep {
    val(): number
}

abstract class Dep {
    constructor() {}
    abstract val(): number
}

// 声明一个依赖
// 等效于 AddDependency(new DepImpl(), { alias: [Dep], uniqueId: 'DepImpl' }) ， AddDependency 不支持singleton
@Dependency({ alias: [Dep], lifecycle: 'singleton', uniqueId: 'DepImpl' })
class DepImpl extends Dep {
    val(): number {
        return Date.now()
    }
}

// 创建 GET 请求控制器（仅支持类）
@Controller()
class GetController {
    // 注入DepImpl
    @Injection()
    dep1!: DepImpl
    // 注入抽象类Dep
    @Injection()
    dep2!: Dep
    // 通过uniqueId查找对象注入IDep
    @Injection({ uniqueId: 'DepImpl' })
    dep3!: IDep

    // 解析依赖DepImpl
    dep4 = ResolveDependency(DepImpl)
    // 解析依赖Dep
    dep5 = ResolveDependency(Dep)
    // 通过uniqueId，解析依赖IDep
    dep6 = ResolveDependencyFromUniqueId<IDep>('DepImpl')
    // 返回一个字符串
    @HttpGet()
    test1(): string {
        const arr: Array<IDep | undefined> = [this.dep1, this.dep2, this.dep3, this.dep4, this.dep5, this.dep6]
        arr.forEach(console.log) // 日志输出注入/解析对象
        return `GetController test1 = ${new Date().toLocaleTimeString()}`
    }
}

const app = new Koa()
app.use(KoaRestful({ logs: true })) // 使用 KoaRestful 插件
app.listen(3000) // 创建 http://localhost:3000

console.log('启动成功，3秒后执行 restful api 请求。')
console.log('http://localhost:3000')
