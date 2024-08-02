const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController')

router.get('/', orderController.findAll);
router.get('/:id', orderController.findOne);
router.put('/:id', orderController.updateStatus);
router.post('/', orderController.createOrder);
router.post('/payment/:id', orderController.payment);
router.post('/notification', orderController.handleNotification);

module.exports = router;