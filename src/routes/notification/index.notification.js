'use strict'

const express = require('express')

const asyncHandler = require('../../helpers/asyncHandler.js')
const NotificationController = require('../../controllers/inventory.controller.js')
const {authenticationV2} = require('../../auth/authUtils.js')

const router = express.Router()

//user does not login

router.use(authenticationV2)

// user has been logined
router.post('', asyncHandler(NotificationController.listNotiByUser))


module.exports = router