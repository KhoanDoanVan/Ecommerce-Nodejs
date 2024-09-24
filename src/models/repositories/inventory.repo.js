'use strict'

const inventory = require('../inventory.model.js')

const insertInventory = async ({ 
    productId, shopId, stock, location = 'unKnow'
  }) => {

  return await inventory.create({
    inven_productId : productId,
    inven_location : location,
    inven_stock : stock,
    inven_shopId : shopId
  })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId : productId,
        inven_stock : {
            $gte : quantity // greater quantity or equal quantity
        }
    }, updateSet = {
        $inc : {
            inven_stock : -quantity
        },
        $push : {
            inven_reservation : {
                quantity,
                cartId,
                createOn : new Date()
            }
        }
    }, options = { upsert : true, new : true }

    return await inventory.updateOne(query, updateSet, options)
}

module.exports = {
    insertInventory,
    reservationInventory
}