'use strict'

const express = require('express')

const asyncHandler = require('../../helpers/asyncHandler.js')
const CommentController = require('../../controllers/comment.controller.js')
const {authenticationV2} = require('../../auth/authUtils.js')

const router = express.Router()

router.use(authenticationV2)

router.post('', asyncHandler(CommentController.createComment))
router.delete('', asyncHandler(CommentController.deleteComment))
router.get('', asyncHandler(CommentController.getListComments))

module.exports = router