'use strict'

const cloudinary = require('../configs/cloudinary.config.js')

class UploadCloudService{
  
  static async uploadImageFromUrl(){
    try{
      const urlImage = 'http://down-vn.img.sduwd.com/file/dw-wxs' // link image
      const folderName = 'product/shopId', newFileName = 'testdemo'

      const result = await cloudinary.uploader.upload(urlImage, {
        public_id : newFileName,
        folder : folderName
      })

      return result

    } catch (error) {
      console.error(`Error uploadImageFromUrl::`, error)
    }
  }

  static async uploadImageFromLocal({ path, folderName = 'product/productId' }){
    try{
      const result = await cloudinary.uploader.upload(path, {
        public_id : 'thumb',
        folder : folderName
      })

      return {
        image_url : result.secure_url,
        shopId : '8080',
        thumb_url : await cloudinary.url(result.public_id, {
          height : 100,
          width : 100,
          format : 'jpg'
        })
      }
    } catch(error){
      console.error(`Error uploadImageFromLocal::`, error)
    }
  }
}

module.exports = UploadCloudService