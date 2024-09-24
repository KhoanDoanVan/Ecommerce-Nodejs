'use strict'

const ProductService = require('../services/product.service.js');
const ProductServiceV2 = require('../services/product.service.xxx.js')
const {SuccessResponse} = require('../core/success.response.js');

class ProductController {

  // CREATE PRODUCT
  createProduct = async (req, res, next) => {

    // new SuccessResponse({
    //   message : " Create product success !!!",
    //   metadata : await ProductService.createProductFactory( req.body.product_type, {
    //     ...req.body,
    //     product_shop : req.user.userId
    //   })
    // }).send(res);

    new SuccessResponse({
      message : "Create product success !!!",
      metadata : await ProductServiceV2.createProduct( req.body.product_type, {
        ...req.body,
        product_shop : req.user.userId
      })
    }).send(res);
  }


  // PUBLISH
  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message : "Create new publish product success !!!",
      metadata : await ProductServiceV2.publishProductByShop({
        product_id : req.params.id,
        product_shop : req.user.userId
      })
    }).send(res);
  }

  // UNPUBLISH
  unpublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message : "Create new publish product success !!!",
      metadata : await ProductServiceV2.unpublishProductByShop({
        product_id : req.params.id,
        product_shop : req.user.userId
      })
    }).send(res);
  }

  // QUERY

  /**
     * @desc Get all Drafts for shop
     * @param  {Number} limit        [description]
     * @param  {Number} skip         [description]
     * @return {JSON}                      [description]
     */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message : "Get All Drafts For Shop Success !!!",
      metadata : await ProductServiceV2.findAllDraftsForShop({
        product_shop : req.user.userId
      })
    }).send(res);
  }

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message : "Get All Publish For Shop Success !!!",
      metadata : await ProductServiceV2.findAllPublishForShop(req.user.userId)
    }).send(res);
  }

  getAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message : "Search Product Success !!!",
      metadata : await ProductServiceV2.findAllProducts(req.query)
    }).send(res);
  }

  getProduct = async (req, res, next) => {
    new SuccessResponse({
      message : "Search Product Success !!!",
      metadata : await ProductServiceV2.findProduct({
        product_id : req.params.product_id
      })
    }).send(res);
  }

  // SEARCH
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message : "Search Product Success !!!",
      metadata : await ProductServiceV2.getListSearchProductByUser({
        keySearch : req.params.keySearch
      })
    }).send(res);
  }

  // UPDATE
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message : "Update Product Success !!!",
      metadata : await ProductServiceV2.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop : req.user.userId
        }
      )
    }).send(res);
  }
}

module.exports = new ProductController();