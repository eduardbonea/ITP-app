const express = require('express');
const router = express.Router();
const booking = require('../controllers/booking');

router.get('/', booking.getAllbooking);
router.get('/:id', booking.getBookingById);
router.post('/', booking.createBooking);
router.put('/:id', booking.updateBooking);
router.delete('/:id', booking.deleteBooking);

module.exports = router;
