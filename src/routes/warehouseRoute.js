const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');

router.get('/', warehouseController.findAll);
router.get('/:id', warehouseController.findOne);

module.exports = router;
