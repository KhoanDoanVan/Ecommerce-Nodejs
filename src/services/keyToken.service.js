'use strict'

const keyTokenModal = require('../models/keytoken.model.js');
const {ObjectId} = require('mongodb');
const {BadRequestError} = require('../core/error.response.js');

class keyTokenService {

  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try{
      const filter = { user : userId }, update = {
        publicKey, privateKey, refreshTokensUsed : [], refreshToken
      }, options = { upsert : true, new : true }

      const tokens = await keyTokenModal.findOneAndUpdate(filter, update, options);

      return tokens ? tokens.publicKey : null;

    } catch (error) {
      return error
    }
  }

  static findById = async (id) => {

    const newId = new ObjectId(id);

    if(ObjectId.isValid(newId)){

      return await keyTokenModal.findOne({ user : newId});

    } else {
      throw new BadRequestError('Error : ObjectId is not valid !!!')
    }
  }

  static deleteById = async (id) => {

    const newId = new ObjectId(id);

    if(ObjectId.isValid(newId)){

      return await keyTokenModal.deleteOne({ user : newId});

    } else {
      throw new BadRequestError('Error : ObjectId is not valid !!!');
    }
  }


  static findByRefreshTokenUsed = async ( refreshToken ) => {
    return await keyTokenModal.findOne( { refreshTokenUsed : refreshToken } );
  }

  static findByRefreshToken = async ( refreshToken ) => {
    return await keyTokenModal.findOne({ refreshToken });
  }


  static deleteKeyById = async (userId) => {
    
    const newId = new ObjectId(userId);

    if(ObjectId.isValid(newId)){
      return await keyTokenModal.deleteOne({ user : newId})

    } else {
      throw new BadRequestError('Error : ObjectId is not valid !!!');
    }

  }

  static updateRefreshToken = async (tokens, refreshToken) => {
    return await keyTokenModal.updateOne({ refreshToken }, {
      $set : {
        refreshToken : tokens.refreshToken
      },
      $addToSet : {
        refreshTokensUsed : refreshToken // refresh old used into array refreshTokensUsed
      }
    })
  }
}

module.exports = keyTokenService;