# npm 包搭建流程

> 本仓库基于rollup制作一个基础的npm开发包，并总结了相关过程，可根据自己的需求酌情修改。本仓库详细介绍了整个项目的搭建过程，如果感觉有用点击这里》》。

# 以下是本仓库详细搭建过程
## 创建npm初始项目

本项目是以公共组织的形式创建，组织名称定位`v3p`，是`vue3plugin`的一个缩写，含义也就是表面的含义。

首先，找个自己合适的文件夹，创建`npm-pkg-by-rollup`文件夹，在该文件夹下面运行`cmd`，输入`npm init --yes`, 此时文件夹下面就会生成`package.json`文件，暂且讲`version`修改为`0.0.0`

在文件夹下面分别创建`dist`、`demo`、`src`文件夹，`dist`是输出目录，也就是最终要上传的npm包、`demo`是个演示的目录，一般创建一个前端项目放到里面就可以了、`src`源码目录，也就是写这个包的目录，在里面写上`index.ts`项目就搭建完成了。

## 打包过程

选择使用`rollupjs`[^1]，将本项目搭建成可以完成项目的打包输出。

[^1]: rollupjs参考文档 https://rollupjs.org/introduction/

打包配置参考[rollup.config.ts](https://github.com/vue3plugin/npm-pkg-by-rollup/blob/main/rollup.config.ts)

在`package.json`文件当中，分别添加如下参数

- scripts 添加相关打包脚本
- main 添加cjs模块引入
- files 包分发包含的文件
- exports 分模块化引入

## 创建tsconfig.json/tsconfig.types.json

`tsconfig.types.json` 用于打包类型文件输出

### 包管理命令

`npm run build` 用于打包

`npm run build-types` 用于打包类型

npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]

alias: verison

### 许可证

创建新文件 输入 LICENSE

### 发布

npm publish --access public

### 加入组织

npm init --scope=v3p

### 相关介绍网页

[Rollup + TypeScript 编译类型声明文件](https://juejin.cn/post/7083862577578508324)
[从0到1搭建 Rollup + TypeScript 模板工程](https://blog.csdn.net/super_ying123/article/details/124139870)

### package 包导出总结

1. main
作为模块被别的程序导入时，模块的主入口，默认为根目录的 index.js 文件。

2. files
用于配置包发布时，所包含的内容，默认为[“*”]

3. type
nonde执行时的模块类型，commonjs 或 module 默认为 commonjs

4. exports
在模块引用时，替代 main 入口，mian 入口只能导出单个文件，

```js
"exports": {
  ".": {
    "import": "./dist/my-lib.js",
    "require": "./dist/my-lib.umd.cjs"
  }
}
```