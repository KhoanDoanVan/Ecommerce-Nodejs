"use strict"

const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} = require('../configs/s3.config.js')

const crypto = require('crypto')

// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer')

const urlImagePublic = `https://d7zsvbt80tx3q.cloudfront.net` // link cloudfront (public)

class AWSService{

  static async uploadImageFromS3({ file }){
    try{

      const randomImageName = await crypto.randomBytes(64).toString('hex') // if don't use random name, file will overriding it if file be uploaded same name again

      const command = new PutObjectCommand({
        Bucket : process.env.AWS_BUCKET_NAME,
        Key : randomImageName || 'unknown',
        Body : file.buffer, // router use memory so use buffer
        ContentType : 'image/jpeg'
      })

      const result = await s3.send(command)

      // -----------------S3-------------------
      // const signedUrl = new GetObjectCommand({
      //   Bucket : process.env.AWS_BUCKET_NAME,
      //   Key : randomImageName
      // })

      // const url = await getSignedUrl(s3, signedUrl, {
      //   expiresIn : 3600
      // })
      // 
      
      // ----------------Cloudfront--------------
      const url = await getSignedUrl({
        url : `${urlImagePublic}/${randomImageName}`,
        keyPairId : process.env.AWS_BUCKET_DISTRIBUTIONS_KEY,
        dateLessThan : new Date( Date.now() + 1000 * 60 ),
        privateKey : process.env.AWS_BUCKET_PRIVATE_KEY_ID
      })

      return {
        url,
        result
      }

      // return url

      // return {
      //   url : `${urlImagePublic}/${randomImageName}`,
      //   result
      // }

    } catch(error){
      console.error(`Error uploadImageFromS3`, error)
    }
  }
}

module.exports = AWSService