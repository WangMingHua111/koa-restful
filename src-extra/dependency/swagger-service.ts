import { AddController, CacheService, CreateAST2OpenAPI, HttpGet, Injection } from '@wangminghua/koa-restful'
import { SimpleAuthorize } from '../authorization'
import { securitySchemes } from '../utils/security-scheme'
class SwaggerController {
    static openapi: ReturnType<typeof CreateAST2OpenAPI>

    @Injection()
    cache?: CacheService

    @HttpGet('')
    index() {
        return `<!DOCTYPE html>
<html>
<head>
  <title>Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.10.3/swagger-ui.min.css">
</head>
<body>
  <div id="swagger-ui"></div>

  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.10.3/swagger-ui-bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.10.3/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {

      const ui = SwaggerUIBundle({
        url: '/swagger/json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      })
    }
  </script>
</body>
</html>`
    }
    @HttpGet()
    async json(): Promise<any> {
        const read = () => {
            const openapi = SwaggerController.openapi

            const parseStr = openapi.parse()
            return JSON.parse(parseStr)
        }
        if (this.cache) {
            return await this.cache.get(`sys:${SwaggerController.name}:json`, async () => {
                return read()
            })
        } else {
            return read()
        }
    }
}
type ArgsType = Parameters<typeof CreateAST2OpenAPI>

/**
 * 添加SwaggerUI
 * @param swaggerDir 控制器扫描目录，默认值
 */
export function AddSwaggerUI(...args: ArgsType) {
    const openapi = CreateAST2OpenAPI(...args)

    // 添加 SimpleAuthorize 支持输出路由授权
    openapi.addAuthorizeDecoratorName(SimpleAuthorize.name)

    // 添加授权模式
    for (const authorizationScheme in securitySchemes) {
        openapi.addSecurityScheme(authorizationScheme, securitySchemes[authorizationScheme])
    }
    AddController(SwaggerController, '/swagger', { prefix: '' })
    SwaggerController.openapi = openapi

    return openapi
}
