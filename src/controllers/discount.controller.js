'use strict'


const DiscountService = require('../services/discount.service.js')
const {
    OkSuccess,
    CreatedSuccess,
    SuccessResponse
} = require('../core/success.response.js')

class DiscountController{

    createDiscount = async (req, res, next) => {
        new CreatedSuccess({
            message : 'create discount success',
            metadata : await DiscountService.createDiscount({
                ...req.body,
                shopId : req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodeWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message : 'get all discount success',
            metadata : await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query
            })
        }).send(res)
    }

    getAllDiscountCodeByShop = async (req, res, next) => {
        new SuccessResponse({
            message : 'get all discount success',
            metadata : await DiscountService.getAllDiscountCodeByShop({
                ...req.body,
                shopId : req.user.userId
            })
        })
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message : 'get discount amount',
            metadata : await DiscountService.getDiscountAmount({
                ...req.body
            })
        })
    }
}

module.exports = new DiscountController()
