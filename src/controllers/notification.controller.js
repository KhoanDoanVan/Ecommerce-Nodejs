'use strict'

const {
  SuccessResponse
} = require('../core/success.response.js')

const NoticationService = require('../services/notification.service.js')

class NotificationController{
  listNotiByUser = async ( req, res, next) => {
    new SuccessResponse({
      message : 'get list noti by user success',
      metadata : await NoticationService.listNotiByUser( req.query )
    }).send(res)
  }
}

module.exports = new NotificationController()