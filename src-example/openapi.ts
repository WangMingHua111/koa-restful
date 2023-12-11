import { CreateAST2OpenAPI } from '@wangminghua/koa-restful'

const api = CreateAST2OpenAPI('src-example/simple.ts', { title: '测试OpenApi' })
console.log(api.parse())
