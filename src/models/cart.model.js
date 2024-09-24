'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'carts'

const cartSchema = new Schema({
  cart_state : {
    type : String,
    required : true,
    enum : ['active', 'inactive', 'failed', 'pending'],
    default : 'active'
  },
  cart_products : {
    type : Array,
    required : true,
    default : []
  },
  cart_count_product : { type : Number, default : 0 },
  cart_userId : { type : Number, required : true }
}, {
  collection : COLLECTION_NAME,
  timestamps : {
    createAt : 'createOn',
    updateAt : 'modifiedOn'
  }
})

module.exports = model(DOCUMENT_NAME, cartSchema)