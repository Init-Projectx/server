const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/cms/orderController')

router.get('/', orderController.findAll);
router.get('/:id', orderController.findOne);

module.exports = router;
