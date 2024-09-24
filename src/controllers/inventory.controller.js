'use strict'

const {
    SuccessResponse
} = require('../core/success.response.js')

const InventoryService = require('../services/inventory.service.js')

class InventoryController{

    static addStockToInventory  = async (req, res, next) => {
        new SuccessResponse({
            message : 'add stock to inventory success',
            metadata : await InventoryService.addStockToInventory( req.body )
        }).send(res)
    }
}

module.exports = InventoryController