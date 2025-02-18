const express = require('express');
const router = express.Router();
const warehouseController = require('../../controllers/cms/warehouseController');

router.get('/', warehouseController.findAll);
router.get('/:id', warehouseController.findOne);
router.post('/', warehouseController.create);
router.put('/:id', warehouseController.update);
router.put('/delete/:id', warehouseController.destroy);
router.put('/activated/:id', warehouseController.activatedWarehouse);

module.exports = router;