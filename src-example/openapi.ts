import { CreateAST2OpenAPI } from '../src'

const api = CreateAST2OpenAPI('src-example/sw.ts', { title: '测试OpenApi' })
console.log(api.parse())
