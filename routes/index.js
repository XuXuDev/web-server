/**
 * @Author: wangxu <ceekey>
 * @Date:   2016-11-22 19:43:56
 * @Email:  xu.wang@ishansong.com
 * @Project: terra
 * @Filename: index.js
 * @Last modified by:   ceekey
 * @Last modified time: 2017-04-28 11:50:37
 */

/*!
 * author
 * Copyright(c) 2016 Wang Xu
 */
'use strict'

let express = require('express');
let path = require('path')
let router = express.Router();
let fs = require('fs');
let _ = require('underscore');
let multer = require('multer')
let upload = multer();
let mkdirp = require('mkdirp');
let config = require('../config/config.js');
let superagent = require('superagent');

/**
 * cookies转发
 *
 */
let setCookies = function(cookies, response) {
    if (Array.isArray(cookies)) {
        cookies.forEach((v) => {
            let cookieArr = v.split(';');
            let optionArr = cookieArr.slice(1);
            let key = cookieArr[0].split("=")[0];
            let value = cookieArr[0].split("=")[1];
            let option = {};
            optionArr.forEach((v) => {
                let optionKey = v.split('=')[0];
                let optionValue = v.split('=')[1];
                if (optionKey === "HttpOnly" && optionValue === undefined) {
                    optionValue = true;
                }
                option[optionKey] = optionValue;
            });
            response.cookie(key, value, option);
        });
    }
    //解决中文乱码问题
    response.writeHead(200, {'Content-Type': '*/*;charset=utf-8'});
};

/**
 * GET路由统一处理分发
 *
 */
router.get('*', function(request, response, next) {
    if (request.xhr === true) {
        superagent.get(config._serverUrl + request.url).set("Cookie", request.headers.cookie).end(function(err, res) {
            logger.info('\n\n\n-----ajax请求(GET)\n-----请求URL:' + config._serverUrl + request.url + '\n-----请求参数:' + JSON.stringify(request.query) + '\n-----返回开始-----\n' + JSON.stringify(res.body) + '\n-----返回结束-----\n\n');
            logger.info('cookies----', res.headers["set-cookie"]);
            setCookies(res.headers["set-cookie"], response);
            response.status(200);
            response.end(JSON.stringify(res.body), 'utf-8');
        });
    } else {
        if (request.path === "/") {
            let view = fs.readFileSync(config._views + config._entry).toString();
            response.status(200);
            response.end(view, 'utf-8');
        } else {
            let view = fs.readFileSync(config._views + request.path).toString();
            response.status(200);
            response.end(view, 'utf-8');
        }
    }
});

/**
  * POST路由统一处理分发
  *
  */
router.post('*', function(request, response, next) {
    if (request.xhr === true) {
        superagent.post(config._serverUrl + request.url).set("Cookie", request.headers.cookie).query(request.body).end(function(err, res) {
            logger.info('\n\n\n-----ajax请求(POST)\n-----请求URL:' + config._serverUrl + request.url + '\n-----请求参数:' + JSON.stringify(request.body) + '\n-----返回开始-----\n' + JSON.stringify(res.body) + '\n-----返回结束-----\n\n');
            setCookies(res.headers["set-cookie"], response);
            response.status(200);
            response.end(JSON.stringify(res.body), 'utf-8');
        });
    } else {
        next();
    }
});

module.exports = router;
