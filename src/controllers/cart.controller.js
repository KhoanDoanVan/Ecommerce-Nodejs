'use strict'

const CartService = require('../services/cart.service.js')
const {
    SuccessResponse
} = require('../core/success.response.js')

class CartController{

    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message : 'add to cart success',
            metadata : await CartService.addToCart( req.body )
        }).send(res)
    }

    update = async (req, res, next) => {
        new SuccessResponse({
            message : 'update user cart success',
            metadata : await CartService.addToCartV2( req.body )
        }).send(res)
    }

    delete = async (req, res, next) => {
        new SuccessResponse({
            message : 'delete product cart success',
            metadata : await CartService.deleteItemToCart( req.body )
        }).send(res)
    }

    getListUserCart = async (req, res, next) => {
        new SuccessResponse({
            message : 'get all product cart success',
            metadata : await CartService.getListUserCart( req.query )
        }).send(res)
    }
}

module.exports = CartController