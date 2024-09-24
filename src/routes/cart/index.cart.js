'use strict'

const express = require('express')

const asyncHandler = require('../../helpers/asyncHandler.js')
const CartController = require('../../controllers/cart.controller.js')
const {authenticationV2} = require('../../auth/authUtils.js')

const router = express.Router()

router.post('', asyncHandler(CartController.addToCart))
router.delete('', asyncHandler(CartController.delete))
router.post('/update', asyncHandler(CartController.update))
router.get('', asyncHandler(CartController.getListUserCart))

module.exports = router