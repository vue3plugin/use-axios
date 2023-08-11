<script lang="ts" setup>
import { onMounted, computed, watchEffect } from 'vue';
import { createAxios } from "../../src";

const { useAxiosRequest, setRequestinterceptors, setResponseinterceptors } =
  createAxios({
    baseURL: "https://any-domain.com",});

// 请求拦截器
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
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 适合做一些不影响数据结构的操作，例如token失效返回登录页面等
setResponseinterceptors((response) => {
  // return response.data
  // 网上许多示例将此处直接设置为 response.data ，一定程度上影响未来响应头的获取，一旦需要使用响应头时，变得异常困难
  // 正确的方式应该是将响应的server二次封装
});

const { response, data, error, edata, execute, aborted, abort, finished, loading } = useAxiosRequest({ url: "/something/{name}" },{
  defaultVal: "",
  immediate: false,
  delay: 100,
  isDebounce: false,
});

onMounted(() => {
  execute({
    data: {},
    params: {},
    path: {},
  })
})
execute({
  path: {
    name: "yigechengzi"
  }
})


</script>
<template>
  {{ data }}
  {{ loading }}
</template>