import { ParameterConverter } from '../shared'

/**
 * 字符串参数转换器，这是默认转换器
 */
export class StringParameterConverter extends ParameterConverter {
    cast(value: string | string[] | undefined): string | undefined {
        if (Array.isArray(value)) {
            return value[0]
        } else if (typeof value === 'string' && value !== '') {
            return value
        } else {
            return undefined
        }
    }
}
/**
 * 字符串数组参数转换器
 */
export class StringArrayParameterConverter extends ParameterConverter {
    cast(value: string | string[] | undefined): string[] {
        if (Array.isArray(value)) {
            return value
        } else if (typeof value === 'string' && value !== '') {
            return [value]
        } else {
            return []
        }
    }
}
/**
 * 数值参数转换器
 */
export class NumberParameterConverter extends ParameterConverter {
    cast(value: string | string[] | undefined): number | undefined {
        if (Array.isArray(value)) {
            return value.length === 0 ? undefined : Number(value[0])
        } else if (typeof value === 'string' && value !== '') {
            return Number(value)
        } else {
            return undefined
        }
    }
}
/**
 * 数值参数数组转换器
 */
export class NumberArrayParameterConverter extends ParameterConverter {
    cast(value: string | string[] | undefined): number[] {
        if (Array.isArray(value)) {
            return value.map((val) => Number(val))
        } else if (typeof value === 'string' && value !== '') {
            return [Number(value)]
        } else {
            return []
        }
    }
}
/**
 * 布尔值参数转换器
 */
export class BooleanParameterConverter extends ParameterConverter {
    cast(value: string | string[] | undefined): boolean | undefined {
        if (Array.isArray(value)) {
            if (value.length === 0) return false
            else {
                return value[0] === '' || value[0] === '0' ? false : true
            }
        } else if (typeof value === 'string') {
            return value === '' || value === '0' ? false : true
        } else {
            return undefined
        }
    }
}

/**
 * 布尔值数组参数转换器
 */
export class BooleanArrayParameterConverter extends ParameterConverter {
    cast(value: string | string[] | undefined): boolean[] {
        if (Array.isArray(value)) {
            return value.map((val) => (val === '' || val === '0' ? false : true))
        } else if (typeof value === 'string') {
            return [value === '' || value === '0' ? false : true]
        } else {
            return []
        }
    }
}
