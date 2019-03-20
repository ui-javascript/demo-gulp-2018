# README

- 没配eslint
- 考虑到IE8 , jquery + layui
- 视图是纯html 不支持jsp ftl...

# 使用说明

- 当前的工程项目文件夹位置与build文件夹同级，并且下划线开头 

- 引用cdn资源如下

```html
<!-- 相对工程文件 eg "_melt" -->
@@include("./header.inc")
@@include("../src/include/jquery.useful.js.inc")
```

- static文件夹
    - 需要监听编译的文件放到_melt/static下,改动会即使同步到 ./static
    - 监听js + images + css(less)
    - 避免static误伤
    
```
_project/static/js/es6.js
=> 
<script src="/static/js/es6.js"></script>

less要编译的文件下划线 "_" 开头
```

- 引用全局样式

```less
// _style.less
@import "../../../src/assets/css/_base/_importAll";
```


- 运行

```
{
    "dev:designStudio": "set SYS_NAME=designStudio && gulp 01-build-dev",
    "build:designStudio": "set SYS_NAME=designStudio && gulp 03-build-dist",
    "sprite:designStudio": "set SYS_NAME=designStudio  && gulp 05-make-sprite",
}
```

- 资源路径配置

```yml
spring:
  # 此资源路径仅开发时使用
  resources:
    static-locations: classpath:/src/assets/,classpath:/static/
```

    
# 目录结构

```
├─_melt 工程文件前加下划线 "_"标识
├─build 构建系统
│  ├─config
│  │  └─system 
│  │      └─melt.js 优先级覆盖 melt.js > index.js
│  │  └─index.js 主要的配置文件
│  └─tasks 各种功能任务
│  
├─cdn 可以配成CDN的静态资源
│  ├─fonts
│  │  ├─font-awesome
│  ├─plus 按照melt=M+E+L+T分类
│  │  ├─effects
│  │  ├─ie
│  │  ├─layout
│  │  ├─model
│  │  └─toolbox
│  ├─tpl
│  └─vendor
│      ├─jquery
├─src 开发目录
│  └─assets
│      ├─css 公用CSS
│      ├─images 公用图片
│      │  └─common
│      │      └─emoji
│      └─libs 公用脚本库
│          ├─mumuy
├─static 编译生成的静态资源(打包的话也包括CDN)
│  ├─css
│  ├─images
│  │  ├─animal
│  │  └─_sprite
│  ├─js
├─templates
```    

# BUG

- 慕课网学习存在图片加载问题

# TODO

- gulp-changed 仅发生变化的 提高性能
- 参考tmt-workflow优化一波
- 前端权限与简单的路由功能
- 模块化与异步
- 样式的MD5后缀
- less报错终止   
- 打包压缩时没有正确剔除文件 

# 关于部署到linux(centos)

- 阿里云配置安全组
- 打开防火墙规则

```shell 
# 防火墙开放
iptables -I INPUT 4 -p tcp -m state --state NEW -m tcp --dport 3306 -j ACCEPT
service iptables save
iptables -nvL // 查看规则
```

- gulp 生成一下软链接 也可能需要全局安装一下browserSync

```shell
unzip dist.zip -d ./dist
npm install -g browser-sync
npm install -g gulp
npm install -D gulp


ln -s /root/node-v6.9.5-linux-x64/bin/gulp /usr/local/bin/gulp
gulp -v

serve 一样生成软link
http://47.100.99.127:5000
```

- 运行

```shell
# 端口配置了 8033
nohup gulp distSync &
open http://47.100.99.127:8033/ch4-corner/index.html (headless无法自动打开)
```
