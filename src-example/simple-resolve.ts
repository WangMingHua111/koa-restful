import { Dependency } from '@wangminghua/koa-restful'
// ResolveDependency, ResolveDependencyFromUniqueId

// 基础类
class BaseClass {
    log(name: string) {
        console.log(`hello ${name}`)
    }
}

// 子类
@Dependency({ alias: [BaseClass], uniqueId: 't-class' })
class TestClass extends BaseClass {
    log2() {}
}

/**
 * 解析依赖
 * @param cls 类型
 * @param opts
 * @returns InstanceType<Class> | undefined
 */
export function ResolveDependency<Class extends abstract new (...args: any) => any>(cls: Class): InstanceType<Class> | undefined {
    return undefined
}

/**
 * 解析依赖（从唯一ID）
 * @param uniqueId 注入依赖的唯一ID
 * @returns InstanceType<Class> | undefined
 */
export function ResolveDependencyFromUniqueId<Class extends new (...args: any) => any>(uniqueId: string): InstanceType<Class> | undefined {
    return undefined
}

const ds = ResolveDependency(BaseClass)
const ds2 = ResolveDependency(TestClass)
const ds3 = ResolveDependencyFromUniqueId('t-class')
ds?.log('a') // output: hello a
ds2?.log('b') // output: hello b
ds3?.log('c') // output: hello c
