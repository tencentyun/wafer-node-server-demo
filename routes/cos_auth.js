'use strict';

const crypto = require('crypto');
const config = require('../config').cos_auth;

module.exports = (req, res) => {
    // code adapted from https://github.com/tencentyun/cos-auth/blob/71096eb9722c070d558a67af977b911d6346f485/cos-auth-server/server.js

    var filePath = req.query.filePath || '';
    if (filePath && filePath.indexOf('/') === 0) filePath = filePath.substr(1);
    var bucket = req.params.bucket; // 空间名称 Bucket

    var appId = config.appId; // 开发者的项目 ID，即COS控制台密钥管理里的 APPID
    var secretId = config.secretId; // 项目的 Secret ID
    var secretKey = config.secretKey; // 项目的 Secret Key

    var expiredTime = 0; // 单次签名，e 必须设置为0；多次有效签名时，e 为签名的时间戳，单位是秒
    var currentTime = parseInt(Date.now() / 1000); // 当前时间戳，是一个符合 Unix Epoch 时间戳规范的数值，单位为秒
    var rand = parseInt(Math.random() * Math.pow(2, 32)); // 随机串，无符号10进制整数，用户需自行生成，最长 10 位
    var fileId = encodeURIComponent('/'+appId+'/'+bucket+'/'+filePath); // 唯一标识存储资源的相对路径。格式为 /appid/bucketname/dirname/[filename]

    // 每个字段具体格式查看文档：https://www.qcloud.com/document/product/436/6054
    var plainText = 'a='+appId+'&k='+secretId+'&e='+expiredTime+'&t='+currentTime+'&r='+rand+'&f='+fileId+'&b='+bucket;
    var data = new Buffer(plainText,'utf8');
    var resStr = crypto.createHmac('sha1', secretKey).update(data).digest();
    var bin = Buffer.concat([resStr,data]);
    var sign = bin.toString('base64');

    res.write(sign);
    res.end();
};
