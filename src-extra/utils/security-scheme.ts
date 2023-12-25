import { OpenAPIV3 } from 'openapi-types'

export const securitySchemes: {
    [name in string]: OpenAPIV3.SecuritySchemeObject
} = {}

/**
 * 添加 SwaggerUI SecurityScheme
 * @param authorizationScheme
 * @param securitySchemeObject
 */
export function AddSecurityScheme(authorizationScheme: string, securitySchemeObject: OpenAPIV3.SecuritySchemeObject) {
    securitySchemes[authorizationScheme] = securitySchemeObject
}
