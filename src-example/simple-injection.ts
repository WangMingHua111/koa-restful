import {
  BaseController,
  Controller,
  Dependency,
  HttpGet,
  Injection,
  KoaRestful,
} from "@wangminghua/koa-restful";
import axios, { type AxiosResponse } from "axios";
import Koa from "koa";

// 声明一个依赖
@Dependency()
class DataSet {
  data() {
    return `${new Date().toISOString()}`;
  }
}

// 创建一个控制器
@Controller()
class TestController extends BaseController {
  // 注入一个依赖
  @Injection()
  ds!: DataSet;
  /**
   * 创建一个 get 请求
   */
  @HttpGet()
  GetNumber() {
    this.http.ok(`获取到：${this.ds.data()}`);
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
    console.log(`请求地址：${req.config.url}`, req.data);
  };
  axios(`${baseurl}/Test/GetNumber`).then(output);
}, 3000);
