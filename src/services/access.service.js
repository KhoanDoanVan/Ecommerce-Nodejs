'use strict'

const keyTokenService = require('./keyToken.service.js');
const shopModel = require('../models/shop.model.js');
const {createTokenPairs, verifyJWT} = require('../auth/authUtils.js');
const {getInforData} = require('../utils/index.js');
const {ConflictRequestError,BadRequestError, AuthFailureError, ForbiddenError} = require('../core/error.response.js');

const {findByEmail} = require('./shop.service.js');

const bcrypt = require('bcrypt');
const crypto = require('crypto');


const RoleShop = {
  SHOP : 'SHOP',
  WRITER : 'WRITER',
  EDITOR : 'EDITOR',
  ADMIN : 'ADMIN'
}

class AccessService {

  static handlerRefreshTokenV2 = async ({ keyStore,user,refreshToken }) => {

    const {userId, email} = user;

    if(keyStore.refreshTokenUsed.includes(refreshToken)){
      await keyTokenService.deleteKeyById(userId); // mandatory user login again to create new token
      throw new ForbiddenError('Error : Something wrong !!! Please Relogin');
    }

    if(keyStore.refreshToken !== refreshToken){
      throw new AuthFailureError('Error : Token is not registered !!!') 
    }

    const foundShop = await findByEmail({ email });
    if(!foundShop) throw new AuthFailureError('Error : Shop is not registered !!!');

    const tokens = await createTokenPairs({userId : foundShop._id, email}, keyStore.publicKey, keyStore.privateKey);

    await keyStore.update({
      $set : {
        refreshToken : tokens.refreshToken
      },
      $addToSet : {
        refreshTokensUsed : refreshToken // refresh old used into array refreshTokensUsed
      }
    })
  }


  static handlerRefreshToken = async ( refreshToken ) => {


    // check token
    const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken);

    // if used
    if(foundToken){

      // check usedId
      const {userId, email} =  await verifyJWT(refreshToken, foundToken.privateKey);

      // delete all keyToken
      await keyTokenService.deleteKeyById(userId); // force user login again to create new token
      throw new ForbiddenError('Error : Something wrong !!! Please Relogin');
    }

    // if not used
    const holderToken = await keyTokenService.findByRefreshToken(refreshToken);
    if(!holderToken) throw new AuthFailureError('Error : Token is not registered !!!')
    // verify token
    const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey);
    // check userId
    const foundShop = await findByEmail({ email });

    if(!foundShop) throw new AuthFailureError('Error : Shop is not registered !!!');

    // create new pairs of key
    const tokens = await createTokenPairs({userId : foundShop._id, email}, holderToken.publicKey, holderToken.privateKey);

    // update token
    const updateToken = await keyTokenService.updateRefreshToken(tokens, refreshToken);

    return {
      user : {userId, email},
      tokens
    }
  }


  static logout = async ( keyStore ) => {
    console.log(keyStore);
    const delKey = await keyTokenService.deleteById(keyStore.user);
    console.log('delKey::', delKey);
    return delKey;
  }


  static login = async ({ email, password, refreshToken = null }) => {
    // check email
    const foundShop = await findByEmail({email});


    if(!foundShop) throw new BadRequestError('Error : foundShop is not found !!!');

    // match
    const match = await bcrypt.compare(password, foundShop.password);

    if(!match) throw new AuthFailureError('Error : Authentication error !!!');

    // create pairs of key
    const publicKey = await crypto.randomBytes(64).toString('hex');
    const privateKey = await crypto.randomBytes(64).toString('hex');

    // create token
    const tokens = await createTokenPairs({userId : foundShop._id, email}, publicKey, privateKey);

    await keyTokenService.createKeyToken({
      refreshToken : tokens.refreshToken,
      publicKey,
      privateKey,
      userId : foundShop._id
    })

    return {
      shop : getInforData({ fields : ['_id' ,'name', 'email'] , object : foundShop }),
      tokens
    }
  }


  static signUp = async ({name, email, password }) => {
      // check email exist
      const holderShop = await shopModel.findOne({ email }).lean();

      if(holderShop) throw new BadRequestError('Error : Shop already exsist !!!');

      const passwordHash = await bcrypt.hash(password, 10); //(value, salt)
      const newShop = await shopModel.create({
        name : name,
        email : email,
        password : passwordHash,
        roles : [ RoleShop.SHOP ],
      })

      if(newShop){
        // create privateKey, publicKey
        // const { publicKey , privateKey } = crypto.generateKeyPairSync('rsa' , {
        //   modulusLength : 4096,
        //   publicKeyEncoding : {
        //     type : 'pkcs1',
        //     format : 'pem'
        //   },
        //   privateKeyEncoding : {
        //     type : 'pkcs1',
        //     format : 'pem'
        //   }
        // })

        const publicKey = await crypto.randomBytes(64).toString('hex');
        const privateKey = await crypto.randomBytes(64).toString('hex');

        const keyStore = await keyTokenService.createKeyToken({
          userId : newShop._id,
          publicKey,
          privateKey
        })


        if(!keyStore) throw new BadRequestError('Error : keyStore is not valid !!!')

        //create token pair
        const tokens = await createTokenPairs({userId : newShop._id}, publicKey, privateKey);
        return {
          shop : getInforData({ fields : ['_id' ,'name', 'email'] , object : newShop }),
          tokens
        }
      } else {
        throw new BadRequestError('Error : newShop is not valid !!!')
      }
  }
}

module.exports = AccessService;