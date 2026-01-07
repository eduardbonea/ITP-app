const express = require('express');
const router = express.Router();

const booking = require('./booking');
const user = require('./user');

router.use('/booking', booking);
router.use('/user', user);

module.exports = router;
