/**
 * @Author: wangxu <ceekey>
 * @Date:   2016-11-22 19:43:56
 * @Email:  xu.wang@ishansong.com
 * @Project: terra
 * @Filename: config.js
 * @Last modified by:   ceekey
 * @Last modified time: 2017-04-27 15:45:52
 */

(function() {
    'use strict';
    var config = {
        _logPath: "./logs/",
        _logFilePre: "server",
        //服务器地址（如：172.31.0.103：8080）
        _serverUrl: "http://m.s.bingex.com/",
        //静态资源HTML文件夹
        _views: "./public/views/",
        //入口文件，跟路由相当于静态资源HTML文件夹的路径
        _entry: "index.html"
    };

    module.exports = config;
})();
