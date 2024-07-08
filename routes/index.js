const router = require('express').Router();
const cartRouter = require('./cartRoute');
const categoryRouter = require('./categoryRoute');
const cityRouter = require('./cityRoute');
const orderRouter = require('./orderRoute');
const productRouter = require('./productRoute');
const provinceRouter = require('./provinceRoute');
const warehouseRouter = require('./warehouseRoute');
const userRouter = require('./userRoute');
const orderController = require('../controllers/orderController');
const authRouter = require('./authRoute');


const { authentication, authorization } = require('../middlewares/auth');

router.use('/v1/api/auth', authRouter);
// cms

const cmsAuthRouter = require('./cms/authRoute');
const cmsCategoryRouter = require('./cms/categoryRoute');
const cmsOrderRouter = require('./cms/orderRoute');
const cmsProductRouter = require('./cms/productRoute');
const cmsStockRouter = require('./cms/stockRoute');
const cmsWarehouseRouter = require('./cms/warehouseRoute');
// cms
router.use('/v1/api/cms/auth', cmsAuthRouter);
router.use('/v1/api/products', productRouter);
router.post('/v1/api/orders/handle_notification/:id', orderController.handleNotification);

router.use(authentication);
router.use('/v1/api/cms/categories', authorization, cmsCategoryRouter);
router.use('/v1/api/cms/orders', authorization, cmsOrderRouter);
router.use('/v1/api/cms/products', authorization, cmsProductRouter);
router.use('/v1/api/cms/stocks', authorization, cmsStockRouter);
router.use('/v1/api/cms/warehouses', authorization, cmsWarehouseRouter);



router.use('/v1/api/carts', cartRouter);
router.use('/v1/api/categories', categoryRouter);
router.use('/v1/api/cities', cityRouter);
router.use('/v1/api/orders', orderRouter);
router.use('/v1/api/provinces', provinceRouter);
router.use('/v1/api/warehouses', warehouseRouter);
router.use('/v1/api/users', userRouter);


module.exports = router;
