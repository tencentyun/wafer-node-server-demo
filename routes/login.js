'use strict';

const LoginService = require('../services/login-service');

module.exports = (req, res) => {
    LoginService.create(req, res).login();
};