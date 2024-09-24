'use strict'

const {
  BadRequestError
} = require('../core/error.response.js')

const {
  getProductById
} = require('../models/repositories/product.repo.js')

const inventory = require('../models/inventory.model.js')

class InventoryService{

  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = '287/21/21 Au Duong Lan'
  }){
    const product = await getProductById(productId)

    if(!product){
      throw new BadRequestError('product does not existed')
    }

    const query = {
      inven_shopId : shopId,
      inven_productId : productId
    }, updateSet = {
      $inc : {
        inven_stock : stock
      },
      $set : {
        inven_location : location
      }
    }, options = { upsert : true, new : true }

    return await inventory.updateOne(query, updateSet, options)
  }
}

module.exports = InventoryService