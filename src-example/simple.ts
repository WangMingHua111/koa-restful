// @ts-nocheck
import {
  BaseController,
  Controller,
  HttpGet,
  KoaRestful,
} from "@wangminghua/koa-restful";
import Koa from "koa";

// 创建一个控制器
@Controller()
class TestController extends BaseController {
  /**
   * 创建一个 get 请求
   */
  @HttpGet()
  GetNumber() {
    this.http.ok(`获取到：${1}`);
  }
  /**
   * 创建一个 get 请求
   */
  @HttpGet("GetNumberRename")
  GetNumber2() {
    this.http.ok(`获取到：${2}`);
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
  const output = async (req: Response) => {
    console.log(`请求地址：${req.url}`, await req.text());
  };
  fetch(`${baseurl}/Test/GetNumber`).then(output);
  fetch(`${baseurl}/Test/GetNumberRename`).then(output);
}, 3000);
