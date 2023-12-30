import { AddDependency, ResolveDependencyFromUniqueId } from '@wangminghua/di'
import { Hook, HookType, KEY_GLOBAL_AFTER_HOOK, KEY_GLOBAL_BEFORE_HOOK } from './shared'

AddDependency([], { uniqueId: KEY_GLOBAL_BEFORE_HOOK })
AddDependency([], { uniqueId: KEY_GLOBAL_AFTER_HOOK })

/**
 * 钩子选项
 */
type HookOptions = {
    /**
     * 钩子类型
     */
    hookType: Extract<HookType, 'globalBeforeHook' | 'globalAfterHook'>
}

/**
 * 添加全局钩子函数
 * @param hook 钩子
 * @param options 选项
 * @returns
 */
export function AddGlobalHook(hook: Hook, options: HookOptions): Hook {
    const { hookType } = options
    switch (hookType) {
        case 'globalAfterHook':
            ResolveDependencyFromUniqueId<Hook[]>(KEY_GLOBAL_AFTER_HOOK)?.push(hook)
            break
        default:
            ResolveDependencyFromUniqueId<Hook[]>(KEY_GLOBAL_BEFORE_HOOK)?.push(hook)
            break
    }
    return hook
}
