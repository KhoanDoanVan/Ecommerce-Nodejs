'use strict'

const {
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError
} = require('../core/error.response.js')

const {
  findCartById
} = require('../models/repositories/cart.repo.js')

const {
  checkProductByServer
} = require('../models/repositories/product.repo.js')

const {
  acquireLock,
  releaseLock
} = require('./redis.service.js')

const order = require('../models/order.model.js')

class CheckoutService{

  // shop_order_ids : [
  //  {
  //    shopId,
  //    shop_discount : [
  //      {
  //        shopId,
  //        discountId,
  //        codeId
  //      }
  //    ],
  //    item_products : [
  //      {
  //        price,
  //        quantity,
  //        productId
  //      }
  //    ]
  //   },
  // ]

  static async checkoutReview({ cartId, userId, shop_order_ids = [] }){

    const foundCart = await findCartById(cartId)
    if(!foundCart){
      throw new BadRequestError('cart does not existed')
    }

    const checkout_order = {
      totalPrice : 0,
      feeShip : 0,
      totalDiscount : 0,
      totalCheckout : 0
    }

    const shop_order_ids_new = []

    // calculator total bill
    for(let i = 0; i < shop_order_ids.length ; i++){

      const { shopId, shop_discounts = [] , item_products = [] } = shop_order_ids[i]

      // check product available
      const checkProductServer = await checkProductByServer(item_products)

      if(!checkProductByServer[0]){
        throw new BadRequestError('order wrong')
      }

      // total price item
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (product.price * product.quantity)
      }, 0)

      // total price before handle
      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw : checkoutPrice, // total price before apply discount
        priceApplyDiscount : checkoutPrice,
        item_products : checkProductServer
      }

      // if shop_discounts exist
      if(shop_discounts.length > 0){
        //  supppose has 1 discount
        const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmount({
          codeId : shop_discounts[0].codeId,
          userId,
          shopId,
          products : checkProductServer
        })

        // total price discount
        checkout_order.totalDiscount += discount

        if(discount > 0){
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      // the last total price
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shop_oder_ids_new,
      checkout_order
    }

  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {}
  }){

    // checking one more wheather have beyond inventory?
    const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
      cartId,
      userId,
      shop_order_ids
    })

    // get new products array
    const products = shop_order_ids_new.flatMap( order => order.item_products )

    const acquireProduct = []

    for(let i = 0; i < products.length ; i++){
      const {productId, quantity} = products[i]
      const keyLock = await acquireLock(productId, quantity, cartId)

      acquireProduct.push(keyLock ? true : false)

      if(keyLock){
        releaseLock(keyLock)
      }
    }

    // check if product no longer in inventory or other reason replace
    if(acquireProduct.includes(false)){
      throw new BadRequestError('acquireProduct has been wrong')
    }

    const newOrder = await order.create({
      order_userId : userId,
      order_checkout : checkout_order,
      order_shipping : user_address,
      order_payment : user_payment,
      order_products : shop_order_ids_new
    })

    return newOrder
  }

  static async getOrderByUser(){}

  static async getOrdersByUser(){}

  static async cancalOrderByUser(){}

  static async updateOrderByShop(){}
}


module.exports = CheckoutService