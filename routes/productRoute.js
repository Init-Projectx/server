const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {authentication} = require('../middlewares/auth');


router.use(authentication);

router.get('/', productController.findAll);
router.get('/:slug', productController.findOne);

module.exports = router;