'use strict'

const NotiModel = require('../models/notification.model.js')

const {
  BadRequestError
} = require('../core/error.response.js')

class NotificationService{

  static async pushNotiToSystem({ type, receivedId, senderId, options = {} }){
    let noti_content

    if(type === 'SHOP-001'){
      noti_content = `@@@ has been add products @@@@`
    } else if(type === 'PROMOTION-001') {
      noti_content = `@@@ has been created promotion @@@@@`
    }

    const newNotify = await NotiModel.create({
      noti_type : type,
      noti_content,
      noti_senderId : senderId,
      noti_receivedId : receivedId,
      noti_options : options
    })

    if(!newNotify){
      throw new BadRequestError('pushNotiToSystem was wrong')
    }

    return newNotify
  }

  static async listNotiByUser({ userId, type = 'ALL', isRead = 0 }){ // test
    const match = { noti_recievedId : userId }

    if(type !== 'ALL'){
      match['noti_type'] = type
    }

    return await NotiModel.aggregate([
      {
        $match : match
      },
      {
        $project : {
          noti_type : type,
          noti_senderId : 1,
          noti_receivedId : 1,
          noti_content : 1,
          createAt : 1,
          noti_options : 1
        }
      }
    ])
  }
}


module.exports = NotificationService