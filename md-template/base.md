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
    <a href="https://github.com/wangminghua111/koa-restful"><strong>探索本项目的文档 »</strong></a>
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

1. Node 版本要求 >= 16.0.0
2. 项目源码必须使用 typescript 编写，并设置 `tsconfig.json` 的 `compilerOptions.experimentalDecorators` 和 `compilerOptions.emitDecoratorMetadata` 为 `true`

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

[![koa-restful-demo 在线测试](https://github.com/wangminghua111/koa-restful/raw/master/images/codesandbox.io.gif)](https://codesandbox.io/p/sandbox/koa-restful-demo-kz4pl8?embed=1&file=%2Fsrc%2Findex.ts%3A20%2C13)
