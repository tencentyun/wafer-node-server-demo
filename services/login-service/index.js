'use strict';

const LoginService = require('qcloud-weapp-server-sdk').LoginService;

LoginService.setAuthUrl('http://10.104.175.21/mina_auth/');

module.exports = LoginService;