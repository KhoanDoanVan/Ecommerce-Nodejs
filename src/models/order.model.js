'use strict'

const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'order'

const orderSchema = new Schema({
  order_userId : { type : String, required : true },
  order_checkout : { type : Object, default : {} },
  /*
    order_checkout : {
      totalPrice,
      totalApplyDiscount,
      feeShip
    }
   */
  order_shipping : { type : Object, default : {} },
   /*
      street,
      city,
      state,
      country
    */
  order_payment : { type : Object, default : {} },
  order_products : { type : Array, required : true },
  order_trackingNumber : { type : String, default : '#000112042023' },
  order_status : { 
    type : String, 
    enum : ['pending', 'confirmed', 'shipped', 'canceled', 'delivered'],
    default : 'pending'
  }
}, {
  timestamps : true,
  collection : COLLECTION_NAME
})


module.exports = model(DOCUMENT_NAME, orderSchema)