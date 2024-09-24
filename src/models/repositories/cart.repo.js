'use strict'

const cart = require('../cart.model.js')
const {
  transformToObjectId
} = require('../../utils/index.js')

const findCartById = async ( cartId ) => {
  const newCartId = await transformToObjectId(cartId)

  return await cart.findOne({
    _id : newCartId,
    cart_state : 'active'
  }).lean()
}

module.exports = {
  findCartById
}