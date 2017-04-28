# web-server
web-server for static files that some project don't have server

# 安装
在项目根目录下运行npm install安装项目的所有依赖，运行npm install supervisor -g全局安装supervisor（修改代码自动重启node服务）

# 配置
在config/config.js中配置服务端IP和端口_serverUrl: "192.168.1.1:8080/";静态资源文件夹 _views: "./public/views/"；跟路由入口文件_entry: "index.html"

# 资源
需要运行的静态资源放在public目录下

# 启动
npm run dev（在控制台打日志）npm run pro（在logs日志文件夹打日志）
