import axios, { InternalAxiosRequestConfig } from "axios"
import type { AxiosError, AxiosResponse, CancelTokenSource } from "axios"
import { ref, shallowRef, computed, unref, watchEffect } from 'vue';
import { debounce } from 'howtools';
import  { UseAxiosRequestConfig, UseExRequestOptions, UseDownLoadExRequestOptions, UseAxiosInstance } from "./types/use";
import { useResponseBlobDownLoad } from './help/download';

export { HttpStatus } from "./help/http"
export type { UseAxiosRequestConfig, UseExRequestOptions, UseDownLoadExRequestOptions, UseAxiosInstance }

export function createAxios(config: UseAxiosInstance) {
    const server = axios.create(config);

    // Axios hook
    /**
     * @param  {AxiosRequestConfig} config
     * @param  {UseExRequestOptions} options?
     * @returns
     */
    function useAxiosRequest<T>(config: UseAxiosRequestConfig, options?: UseExRequestOptions) {
        const { defaultVal = {} } = options || {}
        const isDebounce = options?.isDebounce === undefined || options.isDebounce// 传入防抖函数的值，则认为开启防抖
        const delay = options?.delay ?? 500 // 防抖默认时间设置为1 

        const isLoading = shallowRef(false)
        const isFinished = shallowRef(false)
        const aborted = shallowRef(false)// 请求被中断
        const cancelToken: CancelTokenSource = axios.CancelToken.source()

        const loading = (loading: boolean) => {
            isLoading.value = loading
            isFinished.value = !loading
        }


        const abort = (message?: string) => {
            if (isFinished.value || !isLoading.value) return

            cancelToken.cancel(message)
            aborted.value = true
            isLoading.value = false
            isFinished.value = false
        }


        const response = ref<AxiosResponse<T>>() //axios响应
        const data = ref<T>(defaultVal) //响应数据
        const error = ref<AxiosError>() // axios 错误响应
        const edata = ref() // axios 错误响应数据

        // 不是节流的方式
        const preRequest = ({ params: p, data: d, path: pv }: UseAxiosRequestConfig) => {
            const c = { ...config, params: p, data: d, path: pv }
            return server.request({ ...c, cancelToken: cancelToken.token })
                .then(r => {
                    response.value = r
                    data.value = r.data
                    loading(false)
                })
                .catch((e: AxiosError) => {
                    error.value = e
                    edata.value = e.response ? e.response.data : ""
                    loading(false)
                })
        }

        // 防抖请求
        const request = (config: UseAxiosRequestConfig): Promise<AxiosResponse> => {
            return new Promise((resolve, reject) => {
                const _debounce = debounce<Promise<AxiosResponse>>(preRequest, delay, (response) => {
                    response.then(resolve)
                    response.catch(reject)
                })
                _debounce(config)
            })
        }

        const execute = (config: Pick<UseAxiosRequestConfig, 'params' | 'data' | 'path'> = { params: {}, data: {}, path: {} }) => {
            loading(true)
            return isDebounce ? request(config) : preRequest(config)
        }

        // 立即执行
        if (options?.immediate) execute()

        return {
            response,
            data,
            error,
            edata,
            execute,
            aborted,
            abort,
            finished: isFinished,
            loading: isLoading,
        }
    }

    // 流文件转化为下载函数
    function useBlobDownload<T>(config: UseAxiosRequestConfig, options?: UseDownLoadExRequestOptions) {
        const request = useAxiosRequest<T>({ ...config, responseType: 'blob' }, options)
        const { finished, download } = useResponseBlobDownLoad(options)
        // 全部下载完成标值
        const downLoadFinished = computed(() => unref(request.finished) && unref(finished))

        // 结果响应调用下载，转换blob流
        watchEffect(() => {
            if (!unref(request.finished)) return
            download(unref(request.response) as AxiosResponse)
        })

        return {
            ...request,
            downLoadFinished
        }
    }

    function setRequestinterceptors(onFulfilled?: (value: InternalAxiosRequestConfig) => void, onRejected?: ((error: any) => void) | null): number {
        const requestInterceptor = server.interceptors.request.use((config) => {
            onFulfilled(config)
            return config
        },
            (error) => {
                onRejected && onRejected(error)
                return Promise.reject(error)
            })
        return requestInterceptor
    }

    function setResponseinterceptors(onFulfilled?: (value: AxiosResponse) => void, onRejected?: (error: any) => void | null): number {
        const requestInterceptor = server.interceptors.response.use(
            (response) => {
                onFulfilled(response)
                return response
            },
            (error) => {
                onRejected && onRejected(error)
                return Promise.reject(error)
            })
        return requestInterceptor
    }

    return {
        server,
        useAxiosRequest,
        useBlobDownload,
        setRequestinterceptors,
        setResponseinterceptors,
    }
}
