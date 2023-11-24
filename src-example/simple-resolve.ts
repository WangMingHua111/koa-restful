import { Dependency, ResolveDependency, ResolveDependencyFromUniqueId } from '@wangminghua/koa-restful'
// ResolveDependency, ResolveDependencyFromUniqueId

// 基础类
class BaseClass {
    log(name: string) {
        console.log(`hello ${name}`)
    }
}

// 子类
@Dependency({ alias: [BaseClass], uniqueId: 't-class' })
class TestClass extends BaseClass {}

const ds = ResolveDependency(BaseClass)
const ds2 = ResolveDependency(TestClass)
const ds3 = ResolveDependencyFromUniqueId('t-class')
ds?.log('a') // output: hello a
ds2?.log('b') // output: hello b
ds3?.log('c') // output: hello c
