'use strict';

const LoginService = require('../services/login-service');

module.exports = (req, res) => {
    const loginService = LoginService.create(req, res);

    loginService.check()
        .then(data => {
            res.json({
                'code': 0,
                'message': 'ok',
                'data': {
                    'userInfo': data.userInfo,
                },
            });
        })
        .catch(err => {
            loginService.writeError(err);
        });
};