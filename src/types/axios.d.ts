import type { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios"

declare type RequestInterceptor = (config: AxiosRequestConfig) => AxiosRequestConfig
declare type ResponseInterceptor = (response: AxiosResponse) => AxiosResponse
declare type ErrResponseInterceptor = (err: any) => any

declare interface UseAxiosRequestConfig extends AxiosRequestConfig {
  path?: any
}

declare interface UseAxiosInstance extends AxiosRequestConfig {
}

// 额外参数
declare interface UseExRequestOptions {
  immediate?: boolean, // 是否立即执行
  delay?: number, // 防抖延迟时间
  isDebounce?: boolean, // 是否防抖
  defaultVal?: any
}

declare interface UseDownLoadExRequestOptions extends UseExRequestOptions {
    fileName?: string, // 文件名称
    contentType?: contentTypeStr, // 文件类型
    cbdata?: (res: AxiosResponse) => any, // 返回值处理，默认取 response.data
}
