'use strict';

const LoginService = require('qcloud-weapp-server-sdk').LoginService;

module.exports = (req, res) => {
    LoginService.create(req, res).login();
};