import { Controller, HttpGet } from '@wangminghua/koa-restful'

type M2 = {
    a: number
}
// 测试类型
type TestModel = { name: string; value: string; C: M2 }

function Fn<T>(result: T) {
    return {
        code: 1,
        result,
        c: '12',
    }
}

type Result = {
    code: number
    c: string
}

@Controller()
class OtherController {
    @HttpGet()
    // test3() {
    //     const s = { name: 'n1', value: 'n2', C: { a: 1 } } as TestModel
    //     return Fn(s)
    // }
    @HttpGet()
    test1() {
        const s = { name: 'n1', value: 'n2', C: { a: 1 } }
        return Fn(s)
    }
}
