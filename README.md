# 安装

 `npm i @v3p/use-axios` 

 `pnpm add @v3p/use-axios`

 `yarn add @v3p/use-axios`

# 特性
 1. 默认支持防抖
 2. 每个请求自带终止方法
 3. 响应式错误自动捕获提示，数据自动响应
 4. 拓展流文件下载插件
 5. 内置默认的状态码函数
 6. 增加`path`参数
 
##  使用示例
 
### 示例

```js
const { useAxiosRequest, setRequestinterceptors, setResponseinterceptors } =
  createAxios({
    baseURL: "https://any-domain.com",  // 此处参数和axios原本参数保持一致
  }); 

// 请求拦截器，传参与axios保持一致
setRequestinterceptors(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.warn("token获取失败...");
    }
    if (config.headers) {
      config.headers.Authorization = `Bearer ${
        token || import.meta.env.VUE_APP_TOKEN
      }`;
    }

    return config;
  }
);

// 响应拦截器 ，传参与axios保持一致，适合做一些不影响数据结构的操作，例如token失效返回登录页面等
setResponseinterceptors((response) => {
  //...
});


const { response, data, error, edata, execute, aborted, abort, finished, loading } = useAxiosRequest({ url: "/something/{name}" },{
  defaultVal: "",
  immediate: false,
  delay: 100,
  isDebounce: false,
});

execute({
  path: {
    name: "yigechengzi"
  }
})
```

### 参数解读

`useAxiosRequest(UseAxiosRequestConfig, UseExRequestOptions)`

- 参数 `UseAxiosRequestConfig`, 与 axios 请求配置保持一致，增加了如下参数, [https://axios-http.com/zh/docs/req_config](https://axios-http.com/zh/docs/req_config)

|  参数   | 含义  | 默认值  |
|  ----  | ----   | ----  |
| `path`  | 路径参数 |{} |

----

返回含义如下，所有返回参数值均是可响应的，你可以使用`computed`、`watch`、`watchEffect`等去处理这些参数

|  参数   | 含义  | 
|  ----  | ----   | 
| `response`  | 原生`axios`返回对象 |
| `data`  | 原生`axios`返回对象的`data`属性 |
| `error`  | 原生`axios`返回错误对象 |
| `edata`  | 原生`axios`返回错误对象`data`属性 |
| `execute`  | 执行函数，调用会执行接口调用，传参接收`params`，`data`，`path`三个对象 |
| `aborted`  | 返回一个`boolean`，表示链接是否被中断 |
| `abort`  | 是一个函数，调用会中断当前链接 |
| `finished`  | 表示请求执行完成，请求完成会变为`true` |
| `loading`  | 表示请求是否正在请求，请求完成会变为`false` |
