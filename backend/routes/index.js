const express = require('express');
const router = express.Router();

const booking = require('./booking');
const user = require('./user');

router.use('/bookings', booking);
router.use('/users', user);

module.exports = router;
