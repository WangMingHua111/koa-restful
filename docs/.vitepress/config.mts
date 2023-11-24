import { defineConfig } from 'vitepress'

const config = defineConfig({
    title: 'Koa Restful',
    description: 'Koa Restful 是一个基于 Koa 框架的 Restful Web API 插件开源库，使用 TypeScript 构建。它旨在提供一种轻量、高效、易用的方式来构建 RESTful 风格的后端服务。',
    lastUpdated: true,
    base: '/koa-restful/',
    ignoreDeadLinks: true,
    markdown: {
        toc: {},
    },
    themeConfig: {
        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/WangMingHua111/koa-restful',
            },
        ],
    },
})
export default config
