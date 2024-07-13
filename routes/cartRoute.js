const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/:id', cartController.findOne);
router.put('/:id', cartController.update);
router.delete('/', cartController.reset);
router.delete('/:product_id', cartController.deleteProduct);

module.exports = router;
