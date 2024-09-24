const express = require('express');
const productController = require('../../controllers/product.controller.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authentication, authenticationV2 } = require('../../auth/authUtils.js');


const router = express.Router();

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));
router.get('', asyncHandler(productController.getAllProducts));
router.get('/:product_id', asyncHandler(productController.getProduct));

//authentication
router.use(authenticationV2);
/////////////////////////////////

// Create Product
router.post('', asyncHandler(productController.createProduct));
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.unpublishProductByShop));

// Query Product
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get('/publish/all', asyncHandler(productController.getAllPublishForShop));

module.exports = router;