# vueAdmin-template

> 这是一个 极简的vue admin 管理后台 它只包含了 Element UI & axios & iconfont & permission control ，这些搭建后台必要的东西。
> 基于vue-cli3

## Build Setup

``` bash
# node 
10.16.1

# Clone project
git clone git@10.10.10.110:fast-group/vue-demo.git

# Install dependencies
npm install

# 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# serve with hot reload at localhost:9528
npm run dev

# build for production with minification
npm run build:stage 

# build for production and view the bundle analyzer report
npm run build --report
```

## 说明
- master分支：代码部署总分支包含所有代码
- tgpt分支：托管平台代码分支
- tgpt_v2分支：车务通代码分支  
日常开发只需在对应分支进行开发，线上部署时把对应分支合并到master分支，再打包发布到线上