const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.findOne);
router.put('/', cartController.update);
router.delete('/', cartController.reset);
router.delete('/:product_id', cartController.deleteProduct);

module.exports = router;
