# @wangminghua/koa-restful

文档未完成，后续补充

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />

<p align="center">
  <a href="https://github.com/WangMingHua111/koa-restful/">
    <!-- <img src="images/logo.png" alt="Logo" width="80" height="80"> -->
  </a>

  <h3 align="center">基于 Koa2 快速 Restful Api 框架</h3>
  <p align="center">
    <!-- 基于 Koa2 快速 Restful Api 框架 -->
    <br />
    <a href="https://github.com/WangMingHua111/koa-restful"><strong>探索本项目的文档 »</strong></a>
    <br />
    <br />
    <a href="https://github.com/WangMingHua111/koa-restful">查看Demo</a>
    ·
    <a href="https://github.com/WangMingHua111/koa-restful/issues">报告Bug</a>
    ·
    <a href="https://github.com/WangMingHua111/koa-restful/issues">提出新特性</a>
  </p>

</p>

本篇 README.md 面向开发者

## 目录

- [上手指南](#上手指南)
  - [开发前的配置要求](#开发前的配置要求)
  - [安装步骤](#安装步骤)
- [文件目录说明](#文件目录说明)
- [开发的架构](#开发的架构)
- [部署](#部署)
- [使用到的框架](#使用到的框架)
- [贡献者](#贡献者)
  - [如何参与开源项目](#如何参与开源项目)
- [版本控制](#版本控制)
- [作者](#作者)
- [鸣谢](#鸣谢)

### 上手指南

请将所有链接中的“WangMingHua111/koa-restful”改为“your_github_name/your_repository”

###### 开发前的配置要求

1. xxxxx x.x.x
2. xxxxx x.x.x

###### **安装步骤**

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo

```sh
git clone https://github.com/WangMingHua111/koa-restful.git
```

### 示例代码

```typescript
import {
  BaseController,
  Controller,
  FromQuery,
  FromRoute,
  HttpDelete,
  HttpGet,
  HttpPost,
  HttpPut,
  KoaRestful,
} from "@wangminghua/koa-restful";
import axios, { type AxiosResponse } from "axios";
import Koa from "koa";

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
    this.http.ok(`获取到：${1}`);
  }

  // 创建一个请求，并读取url查询参数，和路径查询参数
  @HttpGet("GetTestParameter/:id")
  GetTestParameter(
    @FromRoute("id") id: string,
    @FromQuery("name") name: string
  ) {
    this.http.ok(`路径参数ID = ${id} 查询参数NAME = ${name}`);
  }
}

const app = new Koa();
app.use(KoaRestful({ logs: true })); // 使用 KoaRestful 插件
app.listen(3000); // 创建 http://localhost:3000

console.log("启动成功，3秒后执行 restful api 请求。");
console.log("http://localhost:3000");

// 3秒后启动测试脚本
setTimeout(() => {
  const baseurl = `http://localhost:3000`;
  const output = async (req: AxiosResponse) => {
    console.log(`${req.config.method} 请求地址：${req.config.url}`, req.data);
  };
  axios.get(`${baseurl}/Test/GetTest`).then(output);
  axios.post(`${baseurl}/Test/GetTest`).then(output);
  axios.put(`${baseurl}/Test/GetTest`).then(output);
  axios.delete(`${baseurl}/Test/GetTest`).then(output);

  axios
    .get(`${baseurl}/Test/GetTestParameter/123`, { params: { name: "hyi" } })
    .then(output);
}, 3000);
```

<!-- ### 文件目录说明

eg:

```
filetree
├── ARCHITECTURE.md
├── LICENSE.txt
├── README.md
├── /account/
├── /bbs/
├── /docs/
│  ├── /rules/
│  │  ├── backend.txt
│  │  └── frontend.txt
├── manage.py
├── /oa/
├── /static/
├── /templates/
├── useless.md
└── /util/

``` -->

<!-- ### 开发的架构

请阅读[ARCHITECTURE.md](https://github.com/WangMingHua111/koa-restful/blob/master/ARCHITECTURE.md) 查阅为该项目的架构。

### 部署

暂无

### 使用到的框架

- [xxxxxxx](https://getbootstrap.com)
- [xxxxxxx](https://jquery.com)
- [xxxxxxx](https://laravel.com)

### 贡献者

请阅读**CONTRIBUTING.md** 查阅为该项目做出贡献的开发者。

#### 如何参与开源项目

贡献使开源社区成为一个学习、激励和创造的绝佳场所。你所作的任何贡献都是**非常感谢**的。

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 版本控制

该项目使用 Git 进行版本管理。您可以在 repository 参看当前可用版本。

### 作者

xxx@xxxx

知乎:xxxx &ensp; qq:xxxxxx

_您也可以在贡献者名单中参看所有参与该项目的开发者。_

### 版权说明

该项目签署了 MIT 授权许可，详情请参阅 [LICENSE.txt](https://github.com/WangMingHua111/koa-restful/blob/master/LICENSE.txt)

### 鸣谢

- [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
- [Img Shields](https://shields.io)
- [Choose an Open Source License](https://choosealicense.com)
- [GitHub Pages](https://pages.github.com)
- [Animate.css](https://daneden.github.io/animate.css)
- [xxxxxxxxxxxxxx](https://connoratherton.com/loaders) -->

<!-- links -->

<!-- [your-project-path]: WangMingHua111/koa-restful
[contributors-shield]: https://img.shields.io/github/contributors/WangMingHua111/koa-restful.svg?style=flat-square
[contributors-url]: https://github.com/WangMingHua111/koa-restful/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/WangMingHua111/koa-restful.svg?style=flat-square
[forks-url]: https://github.com/WangMingHua111/koa-restful/network/members
[stars-shield]: https://img.shields.io/github/stars/WangMingHua111/koa-restful.svg?style=flat-square
[stars-url]: https://github.com/WangMingHua111/koa-restful/stargazers
[issues-shield]: https://img.shields.io/github/issues/WangMingHua111/koa-restful.svg?style=flat-square
[issues-url]: https://img.shields.io/github/issues/WangMingHua111/koa-restful.svg
[license-shield]: https://img.shields.io/github/license/WangMingHua111/koa-restful.svg?style=flat-square
[license-url]: https://github.com/WangMingHua111/koa-restful/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/shaojintian -->
