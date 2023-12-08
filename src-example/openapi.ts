import { Controller, HttpDelete, HttpGet, HttpHead, HttpOptions, HttpPatch, HttpPost, HttpPut } from '@wangminghua/koa-restful'
import { OpenAPIV3 } from 'openapi-types'
import { ClassDeclaration, Project, SourceFile } from 'ts-morph'

// initialize
const project = new Project({})
const files = project.addSourceFilesAtPaths('src-example/simple.ts')
class AST2OpenAPI {
    surceFiles: SourceFile[]
    openapi: OpenAPIV3.Document = {
        info: {
            version: '1.0.0',
            title: 'xxxx',
        },
        openapi: '3',
        paths: {},
    }
    constructor(surceFiles: SourceFile[]) {
        this.surceFiles = surceFiles
    }
    /**
     * 解析openapi json
     * @returns
     */
    parse(): string {
        this.openapi.paths = {}
        const clsArr = this.classes()
        for (const cls of clsArr) {
            this.parseController(cls)
        }
        return JSON.stringify(this.openapi)
    }
    /**
     * 解析控制器
     * @param cls
     */
    parseController(cls: ClassDeclaration) {
        const controllerDeclaration = cls.getDecorator(Controller.name)
        const args = controllerDeclaration?.getArguments()
        // const s = controllerDeclaration?.getArguments()[0]
        const path: OpenAPIV3.PathsObject = (this.openapi.paths[cls.getName() as string] = {})
        // const route = `${prefix}`
        const methodMapping = {
            [HttpGet.name]: 'get',
            [HttpHead.name]: 'head',
            [HttpPost.name]: 'post',
            [HttpPatch.name]: 'patch',
            [HttpPut.name]: 'put',
            [HttpDelete.name]: 'delete',
            [HttpOptions.name]: 'options',
        }
        // const parse_method = (method: De) => {}
        for (const method of cls.getMethods()) {
            const methodName = method.getName()
            const methodComments = method.getJsDocs().map((doc) => doc.getInnerText())
            for (const methodDecorator of method.getDecorators()) {
                const methodDecoratorName = methodDecorator.getName()
                if (!Reflect.has(methodMapping, methodDecoratorName)) continue
                else {
                }
                // const operation: OpenAPIV3.OperationObject = {
                //     tags: [cls.getName() as string],
                //     summary: methodComments?.[0]
                //     responses: {
                //         "200": {}
                //     },
                // }
                // path[methodMapping[methodDecoratorName]] = operation
            }
        }
        //     const routePath = pathDecorator ? pathDecorator.getArguments()[0]?.getText().replace(/'/g, '') : ''; // 获取装饰器中的路径

        //     const httpMethod = pathDecorator?.getName().replace('Http', '').toLowerCase(); // 获取 HTTP 方法名

        //   // 解析方法参数
        //   const parameters = method.getParameters().map(param => {
        //     // 获取参数名
        //     const paramName = param.getName();

        //     // TODO: 解析参数装饰器，根据装饰器类型决定参数位置（query, route, body, header等）

        //     return {
        //       name: paramName,
        //       // TODO: 添加其他参数信息（类型、位置等）
        //     };
        //   });

        // TODO: 填充 swaggerJSON 中的 paths 对象，根据解析的信息生成 Swagger JSON
        // 根据 path、httpMethod、parameters 等信息生成 Swagger JSON
    }

    classes() {
        const temp: ClassDeclaration[] = []
        for (const surceFile of this.surceFiles) {
            surceFile.getClasses().forEach((d) => temp.push(d))
        }
        // 过滤 @Controller
        return temp.filter((cls) => cls.getDecorator('Controller'))
    }
}

const openapi = new AST2OpenAPI(files)
console.log('openapi.parse()', openapi.parse())
