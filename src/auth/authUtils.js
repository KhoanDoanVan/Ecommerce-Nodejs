'use strict'

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler.js');
const keyTokenService = require('../services/keyToken.service.js');
const {NotFoundError, AuthFailureError} = require('../core/error.response.js');

const HEADER = {
  AUTHORIZATION : 'authorization',
  API_KEY : 'x-api-key',
  CLIENT_ID : 'x-client-id',
  RERESHTOKEN : 'x-rtoken-id'
}

const createTokenPairs = async ( payload, publicKey , privateKey ) => {
  try{

    const accessToken = await JWT.sign( payload, publicKey , {
      expiresIn : '2 days'
    })

    const refreshToken = await JWT.sign( payload, privateKey , {
      expiresIn : '7 days'
    })

    await JWT.verify( accessToken, refreshToken, (err, decode) => {
      if(err){
        console.error(`error::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    })

    return {accessToken, refreshToken};

  } catch (error) {
    console.log(error);
  }
}


const authentication = asyncHandler( async (req, res, next) => {
  // check id user
  const userId = req.headers[HEADER.CLIENT_ID];

  if(!userId) throw new AuthFailureError(' Client id is not valid !!!');

  // find id
  const keyStore = await keyTokenService.findById(userId);

  if(!keyStore) throw new NotFoundError(' keyStore is not found !!!');

  // check accessToken
  const accessToken = req.headers[HEADER.AUTHORIZATION]; 

  if(!accessToken) throw new AuthFailureError(' Authorization is not valid !!!');

  // verify 
  try{
    const decodeUser = await JWT.verify( accessToken, keyStore.publicKey );

    if(userId !== decodeUser.userId) throw new AuthFailureError(' Invalid User ');

    req.keyStore = keyStore;
    req.user = decodeUser
    return next()

  } catch (error) {
    throw error;
  }
})

const authenticationV2 = asyncHandler( async (req, res, next) => {
  // check id user
  const userId = req.headers[HEADER.CLIENT_ID];

  if(!userId) throw new AuthFailureError(' Client id is not valid !!!');

  // find id
  const keyStore = await keyTokenService.findById(userId);

  if(!keyStore) throw new NotFoundError(' keyStore is not found !!!');

  if(req.headers[HEADER.REFRESHTOKEN]){
    const refreshToken = req.headers[HEADER.REFRESHTOKEN];

     try{
      const decodeUser = await JWT.verify(refreshToken , keyStore.privateKey);

      if(userId !== decodeUser.userId) throw new AuthFailureError(' Invalid User ');

      req.keyStore = keyStore;
      req.refreshToken = refreshToken;
      req.user = decodeUser;
      return next()

    } catch (error) {
      throw error;
    }
  }
  
})


const verifyJWT = async ( token, keySecret) => {
  return await JWT.verify(token, keySecret);
}

module.exports = {
  createTokenPairs,
  authentication,
  verifyJWT,
  authenticationV2
};