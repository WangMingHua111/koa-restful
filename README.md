# koa-restful

Koa Restful 是一个基于 Koa 框架的 Restful Web API 插件开源库，使用 TypeScript 构建。它旨在提供一种轻量、高效、易用的方式来构建 RESTful 风格的后端服务。

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

 <!-- links -->

[your-project-path]: wangminghua111/koa-restful
[contributors-shield]: https://img.shields.io/github/contributors/wangminghua111/koa-restful.svg?style=flat-square
[contributors-url]: https://github.com/wangminghua111/koa-restful/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/wangminghua111/koa-restful.svg?style=flat-square
[forks-url]: https://github.com/wangminghua111/koa-restful/network/members
[stars-shield]: https://img.shields.io/github/stars/wangminghua111/koa-restful.svg?style=flat-square
[stars-url]: https://github.com/wangminghua111/koa-restful/stargazers
[issues-shield]: https://img.shields.io/github/issues/wangminghua111/koa-restful.svg?style=flat-square
[issues-url]: https://img.shields.io/github/issues/wangminghua111/koa-restful.svg

<!-- PROJECT LOGO -->
<br />

<p align="center">
  <a href="https://github.com/wangminghua111/koa-restful/">
    <img src="https://github.com/wangminghua111/koa-restful/raw/master/images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">"超简单"的 Restful Api</h3>
  <p align="center">
    一个"超简单"的Restful快速开始你的项目！
    <br />
    <a href="https://wangminghua111.github.io/koa-restful/"><strong>探索本项目的文档 »</strong></a>
    <br />
    <br />
    <a href="https://codesandbox.io/p/sandbox/koa-restful-demo-kz4pl8?embed=1&file=%2Fsrc%2Findex.ts%3A20%2C13">查看Demo</a>
    ·
    <a href="https://github.com/wangminghua111/koa-restful/issues">报告Bug</a>
    ·
    <a href="https://github.com/wangminghua111/koa-restful/issues">提出新特性</a>
  </p>

</p>

## 上手指南

### 依赖

```sh
npm install koa @wangminghua/koa-restful
```

### 开发前的配置要求

1. Node 版本要求 >= 16
2. 项目源码必须使用 typescript 编写，并设置 `tsconfig.json` 的 `compilerOptions.experimentalDecorators` 和 `compilerOptions.emitDecoratorMetadata` 为 `true`

### 运行仓库 demo

```sh
# 克隆源码仓库
git clone https://github.com/WangMingHua111/koa-restful.git

# 进入工作目录
cd koa-restful

# npm插入依赖
npm install

# 构建dist、dist-example、README.md
npm run build-all

# 运行示例
npm run run-simple

```

### 工程创建

#### 创建工程目录

```sh
# 你的工程名称
mkdir simple-api
# 进入项目目录
cd simple-api
# npm 初始化，执行npm初始化流程
npm init
# 安装 koa 和 koa-restful
npm install koa @wangminghua/koa-restful
# 执行typescript配置文件初始化
npx tsc --init
```

#### 执行

> 请参照该仓库，也可以按需求自主集成

> [src-example/simple.ts](src-example/simple.ts)

#### 在线测试

传送门 [koa-restful-demo 在线测试](https://codesandbox.io/p/sandbox/koa-restful-demo-kz4pl8?embed=1&file=%2Fsrc%2Findex.ts%3A20%2C13)

![传送门](https://github.com/wangminghua111/koa-restful/raw/master/images/codesandbox.io.gif)

## 示例代码

### src-example\simple.ts 常用示例

```typescript
// src-example/simple.ts
import { Controller, FromBody, FromHeader, FromQuery, FromRoute, HttpDelete, HttpGet, HttpHead, HttpPatch, HttpPost, HttpPut, KoaRestful } from '@wangminghua/koa-restful'
import Koa, { Context } from 'koa'

// 测试类型
type TestModel = { name: string; value: string }

// 创建 GET 请求控制器（仅支持类）
@Controller()
class GetController {
    // 返回一个字符串
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
    test2(@FromBody() body: TestModel): TestModel {
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
```

### src-example\di.ts 依赖注入示例

```typescript
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
```
