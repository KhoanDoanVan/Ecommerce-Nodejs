'use strict'

const discount = require('../models/discount.model.js')
const {transformToObjectId} = require('../utils/index.js')
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError
} = require('../core/error.response.js')

const {
  findAllProductsRepo
} = require('../models/repositories/product.repo.js')

const {
  findDiscount,
  findAllDiscountCodesUnselect,
  deleleDiscountRepo,
  updateBeforeCancel
} = require('../models/repositories/discount.repo.js')

class DiscountService{

  static async createDiscount(payload){

    const {
      code, start_date, end_date, is_active,
      shopId, min_order_value, product_ids, applies_to, name,
      description, type, value, max_value, max_uses, max_uses_per_user, uses_count, users_used
    } = payload


    if(new Date(start_date) >= new Date(end_date)){
      throw new ForbiddenError('Discount start day must be before Discount end day')
    }

    const foundDiscount = await findDiscount({ shopId, code })

    if(foundDiscount && foundDiscount.discount_is_active){
      throw new ForbiddenError('Discount is already exist')
    }

    const newDiscount = await discount.create({
      discount_name : name,
      discount_description : description,
      discount_type : type,
      discount_code : code, 
      discount_value : value,
      discount_min_order_value : min_order_value || 0,
      discount_max_value : max_value,
      discount_start_date : new Date(start_date),
      discount_end_date : new Date(end_date),
      discount_max_uses : max_uses,
      discount_uses_count : uses_count,
      discount_users_used : users_used,
      discount_shopId : shopId,
      discount_max_uses_per_user : max_uses_per_user,
      discount_is_active : is_active,
      discount_applies_to : applies_to,
      discount_product_ids : applies_to === 'all' ? [] : product_ids
    })
  }


  // update
  static async updateDiscount(){}

  static async getAllDiscountCodeWithProduct({
      code, shopId, userId, limit, page
    }){

    const foundDiscount = await findDiscount({ shopId, code })

    if(!foundDiscount && foundDiscount.discount_is_active){
      throw new NotFoundError('Discount is not exist')
    }

    const { discount_applies_to , discount_product_ids } = foundDiscount

    let products

    if(discount_applies_to === 'all'){
      products = await findAllProductsRepo({
        filter : {
          discount_shopId : transformToObjectId(shopId),
          isPublished : true
        },
        limit : +limit,
        page : +page,
        sort : 'ctime',
        select : ['product_name']
      })
    }

    if(discount_applies_to === 'specific'){
      products = await findAllProductsRepo({
        filter : {
          _id : {
            $in : discount_product_ids
          },
          isPublished : true
        },
        limit : +limit, // convert to Number
        page : +page,
        sort : 'ctime',
        select : ['product_name']
      })
    }

    return products
  }

  static async getAllDiscountCodeByShop({ limit, shopId, page }){
    const discounts = await findAllDiscountCodesUnselect({
      limit : +limit,
      page : +page,
      filter : {
        discount_shopId : transformToObjectId(shopId),
        discount_is_active : true
      },
      unSelect : ['__v', 'discount_shopId'],
      model : discount
    })

    return discounts
  }

  static async getDiscountAmount({ codeId , userId, shopId, products }){

    const foundDiscount = await findDiscount({ shopId, codeId })

    if(!foundDiscount){
      throw new NotFoundError('discount is not exist')
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_end_date,
      discount_start_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value
    } = foundDiscount

    if(!discount_is_active){
      throw new NotFoundError('discount experied')
    }

    if(!discount_max_uses){
      throw new NotFoundError('discount are out')
    }

    if(new Date(discount_start_date) >= new Date(discount_end_date)){
      throw new ForbiddenError('Discount start day must be before Discount end day')
    }

    let totalOrder = 0

    if(discount_min_order_value > 0){
      totalOrder = products.reduce((acc, product) => {
        return acc + ( product.quantity + product.price )
      }, 0)

      if(totalOrder < discount_min_order_value){
        throw new NotFoundError(`discount requires a minimum order value of ${discount_min_order_value}`)
      }
    }

    if(discount_max_uses_per_user > 0){
      const userUseDiscount = discount_users_used.find( user => user.userId === userId)
      if(userUseDiscount){
        //...
      }
    }

    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

    return {
      totalOrder,
      amount,
      totalPrice : totalOrder - amount
    }

  }


  static async deleteDiscount({ shopId, codeId }){
    return await deleleDiscountRepo({shopId, codeId})
  }


  static async cancelDiscount({ shopId, codeId, userId }){
    const foundDiscount = await findDiscount({ shopId, codeId })

    if(!foundDiscount){
      throw new NotFoundError('discount is not exist')
    }

    const idFoundShop = foundDiscount._id

    const result = await updateBeforeCancel({ userId, idFoundShop })

    return result
  }

}

module.exports = DiscountService