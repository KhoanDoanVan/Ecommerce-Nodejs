'use strict'

const multer = require('multer')

const uploadMemory = multer({
  storage : multer.memoryStorage()
})

// be careful in postman need form-data import key = file, value = path file in Body API

const uploadDisk = multer({
  storage : multer.diskStorage({
    destination : function(req, file, callback){
      callback(null, './src/uploads/')
    },
    filename : function(req, file, callback){
      callback(null, `${Date.now()}-${file.originalname}`)
    }
  })
})

module.exports = {
  uploadMemory,
  uploadDisk
}