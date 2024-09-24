'use strict'

const {Types, model, Schema} = require('mongoose')

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'notifications'

// ORDER-001 : order successfull
// ORDER-002 : order failed
// PROMOTION-001 : new promotion
// SHOP-001 : new Product by User following

const NotificationSchema = new Schema({
  noti_type : { type : String, enum : ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001']},
  noti_senderId : { type : Schema.Types.ObjectId, required : true, ref : 'Shop' },
  noti_receivedId : { type : Number, required : true },
  noti_content : { type : String, required : true },
  noti_options : { type : Object, default : {} }
},{
  timestamps : true,
  collection : COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, NotificationSchema)