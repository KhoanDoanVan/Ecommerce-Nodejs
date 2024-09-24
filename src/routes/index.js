const express = require('express');
const {apiKey, permission} = require('../auth/checkAuth.js');
const {
    sendToLoggerDiscord
} = require('../middlewares/index.js')

const router = express.Router();

// logger
router.use(sendToLoggerDiscord)

// check API
router.use(apiKey);

// check Permissions
router.use(permission('0000'));

router.use('/v1/api/checkout', require('./checkout/index.checkout.js'))
router.use('/v1/api/discount', require('./discount/index.discount.js'))
router.use('v1/api/inventory', require('./inventory/index.inventory.js'))
router.use('/v1/api/cart', require('./cart/index.cart.js'))
router.use('/v1/api/comment', require('./comment/index.comment.js'))
router.use('/v1/api/notification', require('./notification/index.notification.js'))
router.use('/v1/api/upload', require('./upload/index.upload.js'))

router.use('/v1/api/product', require('./product/index.product.js')); // search method don't need x-client-id authentication


router.use('/v1/api', require('./access/index.access.js'));

module.exports = router;