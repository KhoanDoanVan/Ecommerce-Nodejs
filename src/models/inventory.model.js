'use strict'

const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'inventories'

const InventorySchema = new Schema({
  inven_productId : { type : Schema.Types.ObjectId, ref : 'Product' },
  inven_location : { type : String, default : 'unKnow' },
  inven_stock : { type : Number, required : true },
  inven_shopId : { type : Schema.Types.ObjectId , ref : 'Shop' },
  inven_reservation : { type : Array, default : [] } // order forward
  /*
    cartId : ,
    stock : 1,
    createOn
   */
}, {
  timestamps : true,
  collection : COLLECTION_NAME
})


module.exports = model(DOCUMENT_NAME, InventorySchema)