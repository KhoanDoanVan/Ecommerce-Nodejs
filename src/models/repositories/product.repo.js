'user strict';

const {product, electronics, clothing, furniture} = require('../product.model.js');
const {ObjectId} = require('mongodb');
const {BadRequestError} = require('../../core/error.response.js');
const {
  getSelectData, 
  unGetSelectData,
  transformToObjectId
} = require('../../utils/index.js');

const findAllDraftsForShopRepo = async ({ query, limit, skip }) => {
  return await queryProduct({query, limit, skip})
}

const findAllPublishForShopRepo = async ({ query, limit, skip }) => {
  return await queryProduct({query, limit, skip})
}

// Search
const getListSearchProductRepo = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product.find(
    {
      isPublished : true, // should searching product be published
      $text : {$search : regexSearch}
    },
    {score : {$meta : 'textScore'}}
  )
  .sort({score : {$meta : 'textScore'}})
  .lean()

  return results;
}


const publishProductByShopRepo = async ({product_shop, product_id}) => {
  const newProductShop = ObjectId(product_shop);
  const newProductId = ObjectId(product_id);

  if(ObjectId.isValid(newProductShop) && ObjectId.isValid(newProductId)){
    const foundShop = await product.findOne({
      product_shop : newProductShop,
      _id : product_id
    });

    if(!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;

    const {modifiedCount} = await product.updateOne(foundShop);

    return modifiedCount;
  } else {
    throw new BadRequestError('ObjectId is not valid !!!');
  }
}

const unpublishProductByShopRepo = async ({product_shop, product_id}) => {
  const newProductShop = ObjectId(product_shop);
  const newProductId = ObjectId(product_id);

  if(ObjectId.isValid(newProductShop) && ObjectId.isValid(newProductId)){
    const foundShop = await product.findOne({
      product_shop : newProductShop,
      _id : product_id
    });

    if(!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;

    const {modifiedCount} = await product.updateOne(foundShop);

    return modifiedCount;
  } else {
    throw new BadRequestError('ObjectId is not valid !!!');
  }
}

const queryProduct = async ({query}) => {
  return await product.find(query)
  .populate('product_shop', 'name email -_id')
  .sort({ updateAt : -1 })
  .skip(skip)
  .limit(limit)
  .lean()
  .exec()
}


const findAllProductsRepo = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'cmon' ? {_id : -1} : {_id : 1};

  const products = await product.find(filter)
  .sort(sortBy)
  .skip(skip)
  .limit(limit)
  .select(getSelectData(select))
  .lean()

  return products;
}

const findProductRepo = async ({ product_id, unSelect}) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect));
}


const updateProductByIdRepo = async ({ productId, payload, model, isNew = true }) => {
  return await model.updateOne(productId, payload, isNew);
}

const getProductById = async (productId) => {
  const newId = transformToObjectId(productId);
  return await product.findOne({ _id : newId})
}

const checkProductByServer = async (products) => {
  return await Promise.all( products.map( async product => {
    const foundProduct = await getProductById(product.productId)
    if(foundProduct){
      return {
        price : foundProduct.product_price,
        quantity : product.quantity,
        productId : product.productId
      }
    }
  }))
}


module.export = {
  findAllDraftsForShopRepo,
  findAllPublishForShopRepo,
  publishProductByShopRepo,
  unpublishProductByShopRepo,
  getListSearchProductRepo,
  findAllProductsRepo,
  findProductRepo,
  updateProductByIdRepo,
  getProductById,
  checkProductByServer
}