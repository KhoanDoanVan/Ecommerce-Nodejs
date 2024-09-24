'use strict'

const RedisPubSub = require('../services/redisPubsub.service.js')

class ProductServiceTest{

    purchaseProduct( productId, quantity ){
        const order = {
            productId,
            quantity
        }

        console.log(`productId::${productId}`)

        return RedisPubSub.publish('purchase_event', JSON.stringify(order))
    }
}

module.exports = new ProductServiceTest()