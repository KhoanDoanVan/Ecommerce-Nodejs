'use strict'

const express = require('express')

const asyncHandler = require('../../helpers/asyncHandler.js')
const CheckoutController = require('../../controllers/checkout.controller.js')
const {authenticationV2} = require('../../auth/authUtils.js')

const router = express.Router()

router.post('/review', asyncHandler(CheckoutController.checkoutReview))


module.exports = router