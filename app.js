/**
 * @Author: wangxu <ceekey>
 * @Date:   2016-11-22 19:43:56
 * @Email:  xu.wang@ishansong.com
 * @Project: terra
 * @Filename: app.js
 * @Last modified by:   ceekey
 * @Last modified time: 2017-04-27 14:19:12
 */

'use strict'

let express = require('express');
let fs = require('fs');
let mkdirp = require('mkdirp');
let path = require('path');
let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let compression = require('compression');
let app = express();
let config = require('./config/config.js');
process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || 1314;

/**
 * 判断是否存在日志配置文件夹，不存在则创建
 * 创建后加载日志模块
 *
 */
if (!fs.existsSync(config._logPath)) {
    mkdirp.sync(config._logPath);
    init();
} else {
    init();
}

function init() {
    let loggerModul = require('./log/log.js');
    global.logger = loggerModul.logger;
    logger.info("Nodejs服务器项目启动开始");
    logger.info("日志模块加载成功");
    logger.info('Nodejs服务器项目启动环境：' + process.env.NODE_ENV);
    logger.info('Nodejs服务器项目启动端口：' + process.env.PORT);
    if (process.env.NODE_ENV !== "production") {
        logger.info("启动开发坏境打印模式");
        loggerModul.use(app);
    } else {
        logger.info("启动正式坏境打印模式");
    }

    process.on('uncaughtException', function(err) {
        logger.error(err);
        logger.error(err.stack);
    })

    app.use(compression({filter: shouldCompress}))

    function shouldCompress(req, res) {
        if (req.headers['x-no-compression']) {
            return false
        }
        return compression.filter(req, res)
    }

    app.use(bodyParser.json());
    app.use(favicon(__dirname + '/favicon.ico'))
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', require('./routes/index'));

    logger.info('添加捕获404异常模块');
    //捕获404异常并且重定向到404错误
    app.use(function(req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    logger.info('添加捕获404异常模块成功');
    logger.info('添加异常处理模块');
    // app.use(logErrors);
    // app.use(clientErrorHandler);
    logger.info('添加异常处理模块成功');

    function logErrors(err, req, res, next) {
        logger.error(req.url + '未找到');
        next(err);
    }

    function clientErrorHandler(err, req, res, next) {
        logger.error(req.url + '请求异常');
        res.status(404).send({code: 0, msg: '资源不存在！'});
    }

    module.exports = app;
    logger.info('Nodejs服务器项目启动完成');
}
