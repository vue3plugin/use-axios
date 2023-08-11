import type { AxiosHeaderValue, AxiosRequestConfig, AxiosResponse } from "axios"

export type RequestInterceptor = (config: AxiosRequestConfig) => AxiosRequestConfig
export type ResponseInterceptor = (response: AxiosResponse) => AxiosResponse
export type ErrResponseInterceptor = (err: any) => any

export interface UseAxiosRequestConfig extends AxiosRequestConfig {
  path?: any
}

export interface UseAxiosInstance extends AxiosRequestConfig {
}

// 额外参数
export interface UseExRequestOptions {
  immediate?: boolean, // 是否立即执行
  delay?: number, // 防抖延迟时间
  isDebounce?: boolean, // 是否防抖
  defaultVal?: any
}

export interface UseDownLoadExRequestOptions extends UseExRequestOptions {
  fileName?: string, // 文件名称
  contentType?: string, // 文件类型
  cbdata?: (res: AxiosResponse) => any, // 返回值处理，默认取 response.data
}
