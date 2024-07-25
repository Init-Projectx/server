const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authentication } = require('../middlewares/auth');


router.get('/', productController.findAll);

router.use(authentication);
router.get('/:slug', productController.findOne);
router.get('/category/:categoryId', productController.findByCategory);

module.exports = router;