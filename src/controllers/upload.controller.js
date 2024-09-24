'use strict'

const {
  SuccessResponse
} = require('../core/success.response.js')

const {
  BadRequestError
} = require('../core/error.response.js')

const UploadCloudService = require('../services/upload.service.js')
const AWSService = require('../services/upload.service.js')

class UploadController{

  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message : 'uploadFile success',
      metadata : await UploadCloudService.uploadImageFromUrl()
    }).send(res)
  }

  uploadFileThumb = async (req, res, next) => {

    const {file} = req

    if(!file){
      throw new BadRequestError(`Error file in uploadFileThumb`)
    }

    new SuccessResponse({
      message : 'uploadFileThumb success',
      metadata : await UploadCloudService.uploadImageFromLocal({
        path : file.path
      })
    }).send(res)
  }

  uploadFileS3 = async (req, res, next) => {

    const {file} = req

    if(!file){
      throw new BadRequestError(`Error file in uploadFileS3`)
    }

    new SuccessResponse({
      message : 'uploadFileS3 success',
      metadata : await AWSService.uploadImageFromS3({
        file
      })
    }).send(res)
  }
}

module.exports = new UploadController()