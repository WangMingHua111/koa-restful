import crypto from 'crypto'
import { OpenAPIV3 } from 'openapi-types'
import { ClassDeclaration, Decorator, InterfaceDeclaration, JSDoc, JSDocParameterTag, JSDocUnknownTag, JSDocableNode, MethodDeclaration, Project, SourceFile, Symbol, Type, TypeAliasDeclaration, ts } from 'ts-morph'
import { Authorize, Controller, FromBody, FromHeader, FromQuery, FromRoute, HttpDelete, HttpGet, HttpHead, HttpOptions, HttpPatch, HttpPost, HttpPut, RoutePrefix } from '../restful'
import { DefaultControllerOptions, join } from '../utils/shared'

/**
 * 生成校验码
 * @param inputString
 * @returns
 */
function checksum(inputString: string) {
    // 选择哈希算法（此处使用 md5，您也可以选择其他算法）
    const hash = crypto.createHash('md5')

    // 对输入字符串进行哈希计算
    const checksum = hash.update(inputString).digest('hex')

    // 从哈希结果中提取前 8 位作为校验码
    const eightDigitChecksum = checksum.slice(0, 8)

    return eightDigitChecksum
}
class AST2OpenAPI {
    surceFiles: SourceFile[]
    typeAliases: TypeAliasDeclaration[]
    interfaces: InterfaceDeclaration[]
    authorizeDecorator: Set<string> = new Set()
    openapi: OpenAPIV3.Document = {
        info: {
            version: '1.0.0',
            title: 'OpenAPIV3',
        },
        openapi: '3.0.0',
        paths: {},
        components: {
            schemas: {},
            securitySchemes: {},
        },
    }
    constructor(sourceFile: SourceFile[], info?: Partial<OpenAPIV3.InfoObject>) {
        Object.assign(this.openapi.info, info)
        const typeAliases: TypeAliasDeclaration[] = []
        const interfaces: InterfaceDeclaration[] = []
        this.surceFiles = sourceFile
        this.typeAliases = typeAliases
        this.interfaces = interfaces
        sourceFile.forEach((f) => typeAliases.push(...f.getTypeAliases()))
        sourceFile.forEach((f) => interfaces.push(...f.getInterfaces()))

        this.authorizeDecorator.add(Authorize.name)
    }
    /**
     * 添加安全模式
     * @param authorizationScheme 授权模式名称
     * @param securitySchemeObject
     */
    addSecurityScheme(authorizationScheme: string, securitySchemeObject: OpenAPIV3.SecuritySchemeObject): AST2OpenAPI {
        const securitySchemes = this.openapi.components?.securitySchemes as {
            [key: string]: OpenAPIV3.SecuritySchemeObject | OpenAPIV3.ReferenceObject
        }

        securitySchemes[authorizationScheme] = securitySchemeObject

        return this
    }
    /**
     * 添加授权装饰器名称
     * @param authorizeDecoratorName
     * @returns
     */
    addAuthorizeDecoratorName(authorizeDecoratorName: string): AST2OpenAPI {
        this.authorizeDecorator.add(authorizeDecoratorName)

        return this
    }
    /**
     * 解析openapi json
     * @returns
     */
    parse(): string {
        this.openapi.paths = {}
        const classDeclarators = this.#classes()
        for (const classDeclarator of classDeclarators) {
            this.#parseController(classDeclarator)
        }
        return JSON.stringify(this.openapi)
    }
    /**
     * 解析控制器
     * @param cls
     */
    #parseController(cls: ClassDeclaration) {
        // const controllerDecorator = cls.getDecorator(Controller.name) as Decorator
        const securitySchemes = this.openapi.components?.securitySchemes || {}
        const security = Object.keys(securitySchemes).reduce((t, key) => {
            t[key] = []
            return t
        }, {}) as OpenAPIV3.SecurityRequirementObject
        const methodMapping = {
            [HttpGet.name]: 'get',
            [HttpHead.name]: 'head',
            [HttpPost.name]: 'post',
            [HttpPatch.name]: 'patch',
            [HttpPut.name]: 'put',
            [HttpDelete.name]: 'delete',
            [HttpOptions.name]: 'options',
        }

        for (const method of cls.getMethods()) {
            let isAuthorizeDecorator = false
            for (const authorizeDecoratorName of this.authorizeDecorator) {
                // 如果有鉴权装饰器时
                if (method.getDecorator(authorizeDecoratorName)) {
                    isAuthorizeDecorator = true
                    break
                }
            }
            // const methodName = method.getName()
            const jsdoc = this.#getJsDocs(method)
            for (const methodDecorator of method.getDecorators()) {
                const methodDecoratorName = methodDecorator.getName()
                if (!Reflect.has(methodMapping, methodDecoratorName)) continue // 不是路由方法跳过
                const routePath = this.#parseRoutePath(cls, method, methodDecorator)
                if (!Reflect.has(this.openapi.paths, routePath)) this.openapi.paths[routePath] = {} // 不存在路径时创建路径
                const path = this.openapi.paths[routePath] as OpenAPIV3.PathsObject
                const operation: OpenAPIV3.OperationObject = {
                    tags: [cls.getName() as string],
                    summary: this.#parseMethodComment(jsdoc),
                    parameters: [],
                    description: this.#parseMethodDescription(jsdoc),
                    responses: this.#parseResponses(method),
                    security: isAuthorizeDecorator ? [security] : [],
                }
                // 解析参数
                for (const parameter of method.getParameters()) {
                    const inKEY: Record<string, string> = {
                        path: FromRoute.name, // 路由参数
                        query: FromQuery.name, // 查询参数
                        header: FromHeader.name, // 请求头参数
                    }
                    for (const key in inKEY) {
                        const decorator = parameter.getDecorator(inKEY[key])
                        if (decorator) {
                            const pname = parameter.getName()
                            const firstName = this.#parseFirstParameter(decorator)
                            const description = this.#parseParameterComment(jsdoc, pname)
                            operation.parameters?.push({
                                name: firstName || pname,
                                in: key,
                                required: !parameter.isOptional(),
                                description,
                                schema: this.#parseSchemaObject(parameter.getType()),
                            })
                        }
                    }

                    const bodyDecorator = parameter.getDecorator(FromBody.name)

                    // 生成请求体参数
                    if (bodyDecorator) {
                        const pname = parameter.getName()
                        const description = this.#parseParameterComment(jsdoc, pname)
                        operation.requestBody = {
                            description,
                            content: {
                                [this.#parseMedia(parameter.getType())]: {
                                    schema: this.#parseSchemaObject(parameter.getType()),
                                },
                            },
                            required: !parameter.isOptional(),
                        }
                    }
                }

                path[methodMapping[methodDecoratorName]] = operation
            }
        }
    }

    #parseRoutePath(cls: ClassDeclaration, met: MethodDeclaration, dec: Decorator) {
        const controllerDecorator = cls.getDecorator(Controller.name) as Decorator
        const routePrefixDecorator = cls.getDecorator(RoutePrefix.name)
        const metName = met.getName()
        const route = this.#parseFirstParameter(controllerDecorator)
        const route2 = this.#parseFirstParameter(dec)?.replace(/:(\w+)/g, '{$1}')
        // 默认路由前缀
        let routePrefix = DefaultControllerOptions.defaultRoutePrefix
        // 存在路由前缀时，不使用默认路由前缀
        if (routePrefixDecorator) {
            routePrefix = this.#parseFirstParameter(routePrefixDecorator) as string
        }
        return join(routePrefix, route ?? (cls.getName() || '').replace(/Controller$/i, ''), route2 ?? metName)
    }
    /**
     * 读取装饰器第一个参数，示例：@Controller(`get2`) 读取 get2
     * @param decorator
     * @returns
     */
    #parseFirstParameter(decorator: Decorator) {
        const args = decorator.getArguments() // 获取装饰器参数，第一个参数
        // @Controller('route') 读取 装饰器路由参数
        if (args.length > 0) {
            const controllerRoute = args[0].getText() // 获取装饰器参数的文本值，包括引号
            const cleanedControllerRoute = controllerRoute.replace(/['"`]/g, '') // 去除装饰器参数的引号
            return cleanedControllerRoute
        } else {
            return undefined
        }
    }

    /**
     * 解析注释
     * @param jsdoc
     * @returns
     */
    #parseComment(jsdoc: JSDoc[]) {
        const comments = jsdoc.map((doc) => doc.getCommentText())
        return comments[0]
    }
    /**
     * 是否存在 Type 定义
     */
    #isExistType(typeText: string) {
        const existing = this.typeAliases.some((p) => p.getName() === typeText)
        const existing2 = this.interfaces.some((p) => p.getName() === typeText)
        return existing || existing2
    }
    /**
     * 获取存在的类型
     */
    #getExistType(typeText: string) {
        const existing = this.typeAliases.find((p) => p.getName() === typeText)?.getType()
        if (existing) return existing
        const existing2 = this.interfaces.find((p) => p.getName() === typeText)?.getType()
        if (existing2) return existing2
    }
    /**
     * 解析方法注释
     * @param jsdoc
     * @returns
     */
    #parseMethodComment(jsdoc: JSDoc[]) {
        return this.#parseComment(jsdoc)
    }
    /**
     * 解析方法描述
     * @param jsdoc
     * @returns
     */
    #parseMethodDescription(jsdoc: JSDoc[]): string | undefined {
        for (const doc of jsdoc) {
            for (const tag of doc
                .getTags()
                .filter((tag) => tag instanceof JSDocUnknownTag)
                .map((tag) => tag as JSDocUnknownTag)) {
                if (tag.getTagName() === 'description') {
                    return tag.getCommentText()
                }
            }
        }
        return undefined
    }
    /**
     * 解析参数注释
     * @param jsdoc
     * @returns
     */
    #parseParameterComment(jsdoc: JSDoc[], parameterName: string): string | undefined {
        for (const doc of jsdoc) {
            for (const tag of doc
                .getTags()
                .filter((tag) => tag instanceof JSDocParameterTag)
                .map((tag) => tag as JSDocParameterTag)) {
                if (tag.getName() === parameterName) {
                    return tag.getCommentText()
                }
            }
        }
        return undefined
    }
    #createSchemaObject(type: Type) {
        const typeText = this.#getText(type)
        if (!this.openapi.components?.schemas) {
            this.openapi.components = {
                schemas: {},
            }
        }
        if (this.openapi.components?.schemas && !Reflect.has(this.openapi.components.schemas as any, typeText)) {
            const schema: OpenAPIV3.SchemaObject & {
                properties: OpenAPIV3.BaseSchemaObject
            } = this.#createAnonymousSchemaObject(type)
            this.openapi.components.schemas[typeText] = schema
        }
    }
    #createAnonymousSchemaObject(type: Type) {
        const schema: OpenAPIV3.SchemaObject & {
            properties: OpenAPIV3.BaseSchemaObject
        } = {
            type: 'object',
            properties: {},
        }
        const properties: Symbol[] = []

        if (type.isUnion()) {
            const unionTypes = type.getUnionTypes()
            // 字面量类型转化为枚举
            if (unionTypes.some((t) => t.isLiteral())) {
                schema.type = 'string'
                schema.enum = unionTypes.map((t) => `${t.getLiteralValue()}`)
            } else {
                unionTypes.filter((t) => !t.isLiteral()).forEach((t) => properties.push(...t.getProperties()))
            }
        } else {
            properties.push(...type.getProperties())
        }
        for (const property of properties) {
            var valueDeclarator = property.getValueDeclaration()
            if (!valueDeclarator) continue
            // 泛型类型
            let genericsType: Type | undefined = undefined
            // 如果当前属性是泛型参数
            if (valueDeclarator.getType().isTypeParameter()) {
                const typeStr = this.#getText(type)
                // debugger
                // console.log('typeStr>>>', typeStr)
                const genericsName = new RegExp(`${property.getName()}: ?(\\w+);`, 'g').exec(typeStr)?.[1]
                if (genericsName) {
                    genericsType = this.#getGenericsType(genericsName)
                    genericsType && this.#createSchemaObject(genericsType)
                }
            }

            schema.properties[property.getName()] = this.#parseSchemaObject(genericsType || valueDeclarator.getType(), this.#getJsDocs(valueDeclarator as unknown as JSDocableNode))
        }
        return schema
    }
    #parseNonArraySchemaObject(returnType: Type<ts.Type>): OpenAPIV3.NonArraySchemaObjectType | undefined {
        const ptype = this.#getText(returnType)
        let mtype: OpenAPIV3.NonArraySchemaObjectType | undefined
        switch (ptype) {
            case 'void':
            case 'undefined':
                // 特殊处理控制返回
                break
            case 'string':
            case 'String':
                mtype = 'string'
                break
            case 'number':
            case 'Number':
                mtype = 'number'
                break
            case 'boolean':
            case 'Boolean':
                mtype = 'boolean'
                break
            default:
                mtype = 'object'
                break
        }
        return mtype
    }
    /**
     * 读取参数的Schema
     * @param decorator
     * @returns
     */
    #parseSchemaObject(returnType: Type<ts.Type>, jsdoc?: JSDoc[]): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject {
        const arrayElementType = returnType.getArrayElementType()

        // 数组类型
        if (arrayElementType) {
            return {
                type: 'array',
                description: this.#parseComment(jsdoc || []),
                items: this.#parseSchemaObject(arrayElementType as Type<ts.Type>),
            }
        }
        let mtype: OpenAPIV3.NonArraySchemaObjectType | undefined = this.#parseNonArraySchemaObject(returnType)
        const isOtherType = () => {
            return returnType.isAnonymous() || returnType.isUnionOrIntersection()
        }
        if (mtype === 'object' && this.#isExistType(this.#getText(returnType))) {
            const $ref = `#/components/schemas/${this.#getText(returnType)}`
            this.#createSchemaObject(returnType)
            return {
                $ref,
                description: this.#parseComment(jsdoc || []),
            }
        } else if (mtype === 'object' && isOtherType()) {
            return this.#createAnonymousSchemaObject(returnType)
        } else if (mtype === 'object') {
            const $ref = `#/components/schemas/${this.#getText(returnType)}`
            this.#createSchemaObject(returnType)
            return {
                $ref,
                description: this.#parseComment(jsdoc || []),
            }
        } else if (mtype) {
            return {
                type: mtype,
                description: this.#parseComment(jsdoc || []),
            }
        } else {
            return {}
        }
    }
    #fnTest(returnType: Type<ts.Type>) {
        const tfn = ['isAnonymous', 'isAny', 'isNever', 'isArray', 'isReadonlyArray', 'isTemplateLiteral', 'isBoolean', 'isString', 'isNumber', 'isLiteral', 'isBooleanLiteral', 'isEnumLiteral', 'isNumberLiteral', 'isStringLiteral', 'isClass', 'isClassOrInterface', 'isEnum', 'isInterface', 'isObject', 'isTypeParameter', 'isTuple', 'isUnion', 'isIntersection', 'isUnionOrIntersection', 'isUnknown', 'isNull', 'isUndefined', 'isVoid']
        for (const fnKey of tfn) {
            console.log(`${fnKey} = ${(returnType as any)[fnKey]?.()}`)
        }
    }
    #parseMedia(returnType: Type<ts.Type>): string {
        const mtype = this.#parseNonArraySchemaObject(returnType.getArrayElementType() || returnType)
        let media
        switch (mtype) {
            case 'object':
                media = 'application/json'
                break
            default:
                media = 'text/plain'
                break
        }
        return media
    }
    #parseResponses(method: MethodDeclaration): OpenAPIV3.ResponsesObject {
        let returnType = method.getReturnType()
        // 特殊处理Promise<T>类型的返回值
        if (returnType.getTargetType()?.getText() === 'Promise<T>') {
            returnType = returnType.getTypeArguments()[0]
            // 不存在
            if (!returnType) {
                return {
                    '200': {
                        description: '成功',
                    },
                }
            }
        }
        const mtype = this.#parseNonArraySchemaObject(returnType.getArrayElementType() || returnType)
        let media = this.#parseMedia(returnType)
        return {
            '200': {
                description: '成功', // this.#parseReturnComment(jsdoc)
                content: mtype && {
                    [media]: {
                        schema: this.#parseSchemaObject(returnType),
                    },
                },
            },
        }
    }
    #classes() {
        const temp: ClassDeclaration[] = []
        for (const sourceFile of this.surceFiles) {
            sourceFile.getClasses().forEach((d) => temp.push(d))
        }
        // 过滤 @Controller
        return temp.filter((cls) => cls.getDecorator('Controller'))
    }
    #getText(type: Type<ts.Type>) {
        let typeText = type.getText()
        const result = /^import\(.+\)/i.exec(typeText)
        if (result) {
            const hashStr = checksum(result[0])
            typeText = typeText.replace(/^import\(.+\)/i, hashStr)
        }
        return typeText
    }
    #getJsDocs(node?: JSDocableNode): JSDoc[] {
        return node?.getJsDocs?.() || []
    }
    #getGenericsType(genericsName: string): Type | undefined {
        let name = genericsName
        // 泛型类型不存在时，创建泛型
        if (!this.#isExistType(name)) {
        }
        // console.log('genericsName>>', genericsName)
        return this.#getExistType(name)
    }
}

/**
 * Adds source files based on file globs.
 * @param fileGlobs - File glob or globs to add files based on.
 * @returns AST2OpenAPI
 */
export function CreateAST2OpenAPI(fileGlobs: string | ReadonlyArray<string>, info?: Partial<OpenAPIV3.InfoObject>): AST2OpenAPI {
    const project = new Project()
    const files = project.addSourceFilesAtPaths(fileGlobs)
    return new AST2OpenAPI(files, info)
}

export default CreateAST2OpenAPI
