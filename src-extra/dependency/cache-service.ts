import { AddDependency, CacheService, MemoryCacheService } from '@wangminghua/koa-restful'

/**
 * 添加内存缓存服务
 * @returns
 */
export function AddMemoryCacheService() {
    const cache = new MemoryCacheService()
    AddDependency(cache, { alias: [CacheService] })
    return cache
}
