'use strict'

const express = require('express')

const asyncHandler = require('../../helpers/asyncHandler.js')
const DiscountController = require('../../controllers/discount.controller.js')
const {authenticationV2} = require('../../auth/authUtils.js')

const router = express.Router()

router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
router.get('/listProductCode', asyncHandler(DiscountController.getAllDiscountCodeWithProduct))

//authentication
router.use(authenticationV2)

router.post('', asyncHandler(DiscountController.createDiscount))
router.get('', asyncHandler(DiscountController.getAllDiscountCodeByShop))

module.exports = router