'use strict'

const discount = require('../discount.model.js')
const {
    BadRequestError
} = require('../../core/error.response.js')

const {
    getSelectData,
    unGetSelectData,
    transformToObjectId
} = require('../../utils/index.js')


const findDiscount = async ({ shopId, code }) => {
    try{
        return await discount.findOne({
          discount_shop : transformToObjectId(shopId),
          discount_code : code
        }).lean()
    } catch(error){
        throw new BadRequestError('Error findDiscount')
    }
}

const findAllDiscountCodesUnselect = async ({
        limit = 50, page = 1, sort = 'ctime', filter, unSelect, model 
    }) => {

    const skip = (page - 1) * limit;
    const sortBy = sort === 'cmon' ? {_id : -1} : {_id : 1};

    const products = await discount.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()

    return products;
}

const findAllDiscountCodesSelect = async ({
        limit = 50, page = 1, sort = 'ctime', filter, select, model 
    }) => {

    const skip = (page - 1) * limit;
    const sortBy = sort === 'cmon' ? {_id : -1} : {_id : 1};

    const products = await discount.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return products;
}

const deleleDiscountRepo = async ({ shopId, codeId }) => {
    return await discount.deleteOne({
      discount_code : codeId,
      discount_shopId : transformToObjectId(shopId)
    })
}


const updateBeforeCancel = async ({ userId, idFoundShop }) => {
    return await discount.updateOne(idFoundShop , {
        $pull : {
            discount_users_used : userId
        },
        $inc : {
            discount_max_uses : 1,
            discount_uses_count : -1
        }
    })
}

module.exports = {
    findDiscount,
    findAllDiscountCodesUnselect,
    findAllDiscountCodesSelect,
    deleleDiscountRepo,
    updateBeforeCancel
}