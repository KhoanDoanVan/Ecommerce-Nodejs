'use strict'

const {
    SuccessResponse
} = require('../core/success.response.js')

const CheckoutService = require('../services/checkout.service.js')

class CheckoutController{

    static checkoutReview  = async (req, res, next) => {
        new SuccessResponse({
            message : 'check out review success',
            metadata : await CheckoutService.checkoutReview( req.body )
        }).send(res)
    }
}

module.exports = CheckoutController