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

#### 微信交流群

![微信交流群](https://oss.wangminghua.com/koa-restful/Join.jpg)

## 示例代码

### src-example\simple-alias-injection.ts

```typescript
//src-example\simple-alias-injection.ts
import { BaseController, Controller, Dependency, HttpGet, Injection, KoaRestful } from '@wangminghua/koa-restful'
import axios, { type AxiosResponse } from 'axios'
import Koa from 'koa'
// 声明一个抽象类或者基类
abstract class BaseDataSet {
    abstract data(): string
}
// 声明一个依赖，并设置依赖别名类型为抽象类 BaseDataSet
@Dependency({ alias: [BaseDataSet] })
class DataSet extends BaseDataSet {
    data() {
        return `${new Date().toISOString()}`
    }
}
// 声明一个依赖，并设置依赖唯一Id
@Dependency({ uniqueId: 'data-set' })
class DataSet3 extends BaseDataSet {
    data() {
        return `${new Date().toISOString()}`
    }
}

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
```

### src-example\simple-injection.ts

```typescript
//src-example\simple-injection.ts
import { BaseController, Controller, Dependency, HttpGet, Injection, KoaRestful } from '@wangminghua/koa-restful'
import axios, { type AxiosResponse } from 'axios'
import Koa from 'koa'

// 声明一个依赖
@Dependency()
class DataSet {
    data() {
        return `${new Date().toISOString()}`
    }
}

// 创建一个控制器
@Controller()
class TestController extends BaseController {
    // 注入一个依赖
    @Injection()
    ds!: DataSet
    /**
     * 创建一个 get 请求
     */
    @HttpGet()
    GetNumber() {
        this.http.ok(`获取到：${this.ds.data()}`)
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
```

### src-example\simple-static-injection.ts

```typescript
//src-example\simple-static-injection.ts
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
```

### src-example\simple.ts

```typescript
//src-example\simple.ts
import { BaseController, Controller, FromQuery, FromRoute, HttpDelete, HttpGet, HttpPost, HttpPut, KoaRestful } from '@wangminghua/koa-restful'
import axios, { type AxiosResponse } from 'axios'
import Koa from 'koa'

// 创建一个控制器
@Controller()
class TestController extends BaseController {
    /**
     * 创建一个 get/post/delete/put 请求
     */
    @HttpGet()
    @HttpPost()
    @HttpDelete()
    @HttpPut()
    GetTest() {
        this.http.ok(`获取到：${1}`)
    }

    // 创建一个请求，并读取url查询参数，和路径查询参数
    @HttpGet('GetTestParameter/:id')
    GetTestParameter(@FromRoute('id') id: string, @FromQuery('name') name: string) {
        this.http.ok(`路径参数ID = ${id} 查询参数NAME = ${name}`)
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
    axios.get(`${baseurl}/Test/GetTest`).then(output)
    axios.post(`${baseurl}/Test/GetTest`).then(output)
    axios.put(`${baseurl}/Test/GetTest`).then(output)
    axios.delete(`${baseurl}/Test/GetTest`).then(output)

    axios.get(`${baseurl}/Test/GetTestParameter/123`, { params: { name: 'hyi' } }).then(output)
}, 3000)
```
