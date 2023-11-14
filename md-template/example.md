
### src-example\simple-alias-injection.ts

```typescript

//src-example\simple-alias-injection.ts
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
// 声明一个抽象类或者基类
abstract class BaseDataSet {
  abstract data(): string;
}
// 声明一个依赖，并设置依赖别名类型为抽象类 BaseDataSet
@Dependency({ alias: [BaseDataSet] })
class DataSet extends BaseDataSet {
  data() {
    return `${new Date().toISOString()}`;
  }
}
// 声明一个依赖，并设置依赖唯一Id
@Dependency({ uniqueId: "data-set" })
class DataSet3 extends BaseDataSet {
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
  // 注入一个依赖
  @Injection()
  ds2!: BaseDataSet;
  // 注入一个依赖
  @Injection({ uniqueId: "data-set" })
  ds3!: BaseDataSet;
  /**
   * 创建一个 get 请求
   */
  @HttpGet()
  GetNumber() {
    this.http.ok(
      `ds获取到：${this.ds.data()} ds2获取到：${this.ds2.data()} ds3获取到：${this.ds3.data()}`
    );
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


```

### src-example\simple-injection.ts

```typescript

//src-example\simple-injection.ts
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


```

### src-example\simple-static-injection.ts

```typescript

//src-example\simple-static-injection.ts
import {
  AddDependency,
  BaseController,
  Controller,
  HttpGet,
  Injection,
  KoaRestful,
} from "@wangminghua/koa-restful";
import axios, { type AxiosResponse } from "axios";
import Koa from "koa";

// 声明一个抽象类或者基类
abstract class BaseDataSet {
  abstract data(): string;
}

class DataSet extends BaseDataSet {
  data() {
    return `${new Date().toISOString()}`;
  }
}

class DataSet3 extends BaseDataSet {
  data() {
    return `${new Date().toISOString()}`;
  }
}
// 静态创建一个依赖，并设置依赖别名类型为抽象类 BaseDataSet
AddDependency(new DataSet(), { alias: [BaseDataSet] });
AddDependency(new DataSet3(), { uniqueId: "data-set" });

// 创建一个控制器
@Controller()
class TestController extends BaseController {
  // 注入一个依赖
  @Injection()
  ds!: DataSet;
  // 注入一个依赖
  @Injection()
  ds2!: BaseDataSet;
  // 注入一个依赖
  @Injection({ uniqueId: "data-set" })
  ds3!: BaseDataSet;
  /**
   * 创建一个 get 请求
   */
  @HttpGet()
  GetNumber() {
    this.http.ok(
      `ds获取到：${this.ds.data()} ds2获取到：${this.ds2.data()} ds3获取到：${this.ds3.data()}`
    );
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


```

### src-example\simple.ts

```typescript

//src-example\simple.ts
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
