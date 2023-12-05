import { OpenAPIV3 } from 'openapi-types'
import { ClassDeclaration, Project, SourceFile } from 'ts-morph'

// initialize
const project = new Project({})
const files = project.addSourceFilesAtPaths('src-example/simple.ts')
class AST2OpenAPI {
    surceFiles: SourceFile[]
    openapi: OpenAPIV3.Document = {
        "info": {
            "version": '1.0.0',
            "title": "xxxx",
        },
        "openapi": '3',
        "paths": {}
    }
    constructor(surceFiles: SourceFile[]) {
        this.surceFiles = surceFiles
    }
    /**
     * 解析openapi json
     * @returns
     */
    parse(): string {
        const clsArr = this.classes()
        for (const cls of clsArr) {
            this.parseController(cls)
        }
        return '123'
        // return `${cls.map((p) => p.getName()).join(',')}`
    }
    /**
     * 解析控制器
     * @param cls
     */
    parseController(cls: ClassDeclaration) {
        this.openapi.
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
