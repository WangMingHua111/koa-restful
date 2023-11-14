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
   * 创建一个 get 请求
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
