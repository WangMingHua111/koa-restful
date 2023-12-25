import os from 'node:os'
/**
 * 授权模式
 */
export type AuthorizationSchemes = 'Bearer' | 'Cookie' | 'OAuth'

/**
 * 获取本机有效ip4地址
 * @param internal 仅互联网地址
 */
export function allIPs(internal: boolean = false) {
    // 获取网络接口信息
    const networkInterfaces = os.networkInterfaces()
    // 提取所有网络 IP 地址
    const ips: string[] = []
    Object.keys(networkInterfaces).forEach((interfaceName) => {
        const interfaceInfo = networkInterfaces[interfaceName]
        interfaceInfo?.forEach((iface) => {
            // 过滤掉 loopback 地址和 IPv6 地址
            if (iface.family === 'IPv4' && (!internal || !iface.internal)) {
                ips.push(iface.address === '127.0.0.1' ? 'localhost' : iface.address)
            }
        })
    })
    ips.sort()
    return ips
}
