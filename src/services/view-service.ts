/**
 * 将对象转换为koa传输字符串数据
 * @param obj
 * @returns
 */
function tobj(obj: Object) {
    return JSON.stringify(obj).replace(/"\@func([\w\W]+?)&\$"/g, '$1')
}
/**
 * 将一个函数转换为字符串，支持通过tobj转换的对象在html script中进行函数的反序列化，
 * 禁止在内部编写注释。
 * @param fn
 * @returns
 */
function tfunc<T extends Function>(fn: T): T {
    let t: any = `@func${fn.toString()}&$`.replace(/\r\n/g, '')
    return t
}

/**
 * 视图服务接口（适用于art-template引擎视图数据传输）
 * @link https://aui.github.io/art-template/zh-cn/docs/
 */
interface IViewService {
    /**
     * 视图数据（只读）
     */
    readonly viewData: Record<string, any>
    /**
     * 推送视图数据
     * @param viewData
     */
    pushViewData(viewData: Record<string, any>): IViewService
}

interface IViewScriptService {
    /**
     * 视图数据（只读）
     */
    readonly viewData: Record<string, any> & { _v_script: string }
    /**
     * 推送 Script Data 数据
     * @param viewScriptData 注意如果要传输回调函数，请使用 tfunc 包装
     * @returns
     * ```js
     * pushScriptData({
     *  a: 1,
     *  b: tfunc(()=>{console.log('x')}) // tfunc 函数内部不支持 各种注释，否则会报错
     * })
     * ```
     */
    pushScriptData(viewScriptData: Record<string, any>): IViewService
}

/**
 * 视图服务类（与Art模板通讯）
 */
class ViewService implements IViewService {
    protected readonly _viewData: Record<string, any>
    constructor(viewData: Record<string, any> = {}) {
        this._viewData = viewData
    }
    /**
     * 推送视图数据
     * @param viewData
     */
    public pushViewData(viewData: Record<string, any>): ViewService {
        Object.assign(this._viewData, viewData)
        return this
    }
    /**
     * 获取视图数据，包含 _v_script 字符串
     */
    public get viewData() {
        return this._viewData
    }
}

class ViewScriptService extends ViewService implements IViewScriptService {
    constructor() {
        super({
            _v_script: {},
        })
    }
    public pushScriptData(vueData: Record<string, any>): ViewService {
        const { _v_script } = this._viewData
        Object.assign(_v_script, vueData)
        return this
    }
    /**
     * 获取视图数据，包含 _v_script 字符串
     */
    public get viewData(): Record<string, any> & { _v_script: string } {
        const { _v_script, ...data } = this._viewData
        return {
            ...data,
            _v_script: tobj(_v_script),
        }
    }
}

export { IViewService, ViewScriptService, ViewService, tfunc, tobj }
