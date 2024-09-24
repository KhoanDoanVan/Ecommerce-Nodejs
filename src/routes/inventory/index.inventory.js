'use strict'

const express = require('express')

const asyncHandler = require('../../helpers/asyncHandler.js')
const InventoryController = require('../../controllers/inventory.controller.js')
const {authenticationV2} = require('../../auth/authUtils.js')

const router = express.Router()

router.use(authenticationV2)

router.post('', asyncHandler(InventoryController.addStockToInventory))


module.exports = router