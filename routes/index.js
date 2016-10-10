'use strict';

const express = require('express');
const router = express.Router();

router.get('/login', require('./login'));
router.get('/user', require('./user'));

module.exports = router;