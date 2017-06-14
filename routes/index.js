'use strict';

const express = require('express');
const router = express.Router();

router.get('/', require('./welcome'));
router.get('/login', require('./login'));
router.get('/user', require('./user'));
router.get('/cos_auth/:bucket', require('./cos_auth'));
router.all('/tunnel', require('./tunnel'));

module.exports = router;
