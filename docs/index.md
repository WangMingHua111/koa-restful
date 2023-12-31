---
# 提供三种布局，doc、page和home
# 官方文档相关配置：https://vitepress.dev/reference/default-theme-layout
layout: home
title: 首页
# 官方文档相关配置：https://vitepress.dev/reference/default-theme-home-page
editLink: true

hero:
    name: 👍超简单的Restful
    tagline: Koa Restful 是一个基于 Koa 框架的 Restful Web API 插件开源库，使用 TypeScript 构建。它旨在提供一种轻量、高效、易用的方式来构建 RESTful 风格的后端服务。
    actions:
        - theme: brand
          text: 快速上手
          link: /guide/getting-started
        - theme: alt
          text: GitHub
          link: https://github.com/WangMingHua111/koa-restful

# 按钮下方的描述
features:
    - icon: ✨
      title: 以简单易用为首要的设计
      details: 依赖注入DI、控制器Controller、路由方法Route、参数解析Parameter
    - icon: 🍁
      title: 基于Typescript构建
      details: 解决javascript弱类型语言不支持反射的问题，助力Node实现DI的能力，来达到和Java、C#等强类型语言类似的体验。
    - icon: 💥
      title: 支持依赖注入能力
      details: 通过动态（装饰器）或静态（函数）创建依赖，支持属性自动注入（装饰器）或依赖解析（函数）获取注入的依赖实例（对象）。
    - icon: 🐰
      title: 推荐配合使用
      details: TypeORM 一个支持各种主流数据库的ORM框架、Art Template 一个简约、超快的模板引擎
---
