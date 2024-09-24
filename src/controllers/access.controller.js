'use strict'

const AccessService = require('../services/access.service.js')
const {OkSuccess, CreatedSuccess, SuccessResponse} = require('../core/success.response.js');

class AccessController {

  // handlerRefreshToken = async (req, res, next) => {

  //   new SuccessResponse({
  //     message : "Get new token success !!!",
  //     metadata : await AccessService.handlerRefreshToken(req.keyStore.refreshToken)
  //   }).send(res);
  // }

  handleRefreshTokenV2 = async (req, res, next) => {
    new SuccessResponse({
      message : "Get new token success !!!",
      metadata : await AccessService.handleRefreshTokenV2({
        refreshToken : req.refreshToken,
        user : req.user,
        keyStore : req.keyStore
      })
    })
  }

  logout = async (req, res, next) => {

    new SuccessResponse({
      message : "Logout success !!!",
      metadata : await AccessService.logout(req.keyStore)
    }).send(res);
  }
  

  login = async (req, res, next) => {

    new SuccessResponse({
      message : 'Login Success !!!',
      metadata : await AccessService.login(req.body)
    }).send(res);

  }


  signUp = async (req, res, next) => {

    new CreatedSuccess({
      message : 'Registered Success !!!',
      metadata : await AccessService.signUp(req.body),
      options : {
        limit : 100
      }
    }).send(res);

    // return res.status(201).json(await AccessService.signUp(req.body));

  }
}

module.exports = new AccessController();