const express = require('express');
const router = express.Router();
const productController = require('../../controllers/cms/productController');
const upload = require('../../middlewares/multerProduct');

router.get('/', productController.findAll);
router.get('/:slug', productController.findOne);
router.get('/category/:categoryId', productController.findByCategory);
router.post('/', upload, (req, res, next) => {
    req.err = req.err || null;
    next();
}, productController.create);
router.put('/:slug', upload, (req, res, next) => {
    req.err = req.err || null;
    next();
}, productController.update);
router.put('/delete/:slug', productController.softDelete);
router.put('/activated/:slug', productController.returnSoftDelete);

module.exports = router;
