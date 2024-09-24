const express = require('express');
const UploadController = require('../../controllers/upload.controller.js');
const asyncHandler = require('../../helpers/asyncHandler.js');
const { authentication, authenticationV2 } = require('../../auth/authUtils.js');
const {
    uploadDisk,
    uploadMemory
} = require('../../configs/multer.config.js')


const router = express.Router();

router.post('/product', asyncHandler(UploadController.uploadFile))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(UploadController.uploadFileThumb))

// S3
router.post('/product/bucket', uploadMemory.single('file'), asyncHandler(UploadController.uploadFileS3)) // use memory because has buffer for upload image from s3

module.exports = router;