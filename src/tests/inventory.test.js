'use strict'

const RedisPubSub = require('../services/redisPubsub.service.js')

class InventoryServiceTest{

    constructor(){
        RedisPubSub.subscribe('purchase_event', (channel, message) => {
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(productId, quantity){
        console.log(`Update inventory success with quantity::${quantity} !!!`)
    }
}

module.exports = new InventoryServiceTest()