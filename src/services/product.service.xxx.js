'use strict'

const {product, electronics, clothing, furniture} = require('../models/product.model.js');
const {BadRequestError} = require('../core/error.response.js');
const {
    findAllDraftsForShopRepo, 
    publishProductByShopRepo, 
    findAllPublishForShopRepo,
    unpublishProductByShopRepo,
    getListSearchProductRepo,
    findAllProductsRepo,
    findProductRepo,
    updateProductByIdRepo
} = require('../models/repositories/product.repo.js');

const {
    insertInventory
} = require('../models/repositories/inventory.repo.js')

const NotificationService = require('./notification.service.js')

const {
    removeUndefinedObject,
    updateNestedObjectParser
} = require('../utils/index.js');

class ProductFactory{

    static productRegistry = {};

    static registerProductType( type, classRef ){
        ProductFactory.productRegistry[ type ] =  classRef;
    }

    //create
    static async createProduct( type , payload ){
        const productClass = ProductFactory.productRegistry[type];
        if(!productClass) throw new BadRequestError(`Invalid Product Type ${type}`);

        return new productClass( payload ).createProduct();
    }


    //update
    static async updateProduct( type, objectId, payload ){
        const productClass = ProductFactory.productRegistry[type];
        if(!productClass) throw new BadRequestError(`Invalid Product Type ${type}`);

        return new productClass( payload ).updateProduct(objectId);
    }

    //publish
    static async publishProductByShop({product_shop, product_id}){
        return await publishProductByShopRepo({product_shop, product_id});
    }

    static async unpublishProductByShop({product_shop, product_id}){
        return await unpublishProductByShopRepo({product_shop, product_id});
    }

    //query
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }){
        const query = {product_shop, isDraft : true };
        return await findAllDraftsForShopRepo({query, limit, skip});
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }){
        const query = {product_shop, isPublished  : true };
        return await findAllPublishForShopRepo({query, limit, skip});
    }

    static async findAllProducts({ limit = 50, sort = 'cmon', page = 1, filter = {isPublished} }){
        return await findAllProductsRepo({limit, sort, page, filter, 
            select : ['product_name', 'product_description', 'product_thumb', 'product_shop'] 
        });
    }

    static async findProduct({ product_id }){
        return await findProductRepo({product_id, unSelect : ['__v']});
    }

    //search
    static async getListSearchProductByUser({ keySearch }){
        return await getListSearchProductRepo({keySearch})
    }


}


class Product{

    constructor({
        product_name, product_thumb, product_description, product_price,
        product_type, product_shop, product_attributes, product_quantity
    }) {
        this.product_name = product_name,
        this.product_thumb = product_thumb,
        this.product_description = product_description,
        this.product_price = product_price,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes,
        this.product_quantity = product_quantity
    }

    // async createProduct({ product_id }){
    //     return await product.create({
    //         ...this,
    //         _id : product_id
    //     });
    // }
    
    async createProduct({ product_id }){
        const newProduct = await product.create({
            ...this,
            _id : product_id
        })

        if(newProduct){ // add new product to inventory
            await insertInventory({
                productId : newProduct._id,
                shopId : this.product_shop,
                stock : this.product_quantity
            })


            // add notification
            NotificationService.pushNotiToSystem({ // can't used async await
                type : 'SHOP-001',
                recievedId : 1,
                senderId : this.product_shop,
                options : {
                    product_name : this.product_name,
                    shop_name : this.product_shop
                }
            }).then(rs => console.log(rs))
            .catch(console.error)
        }

        return newProduct
    }

    async updateProduct(productId, payload){
        return await updateProductByIdRepo({ productId, payload, model : product })
    }
}

class Electronics extends Product{

    async createProduct(){
        const newElectronic = await electronics.create({
            ...this.product_attributes,
            product_shop : this.product_shop
        });

        if(!newElectronic) throw new BadRequestError('Error : Create not success electronic');

        const newProduct = await super.createProduct({ product_id : newElectronic._id });

        if(!newProduct) throw new BadRequestError('Error : Create nto success Product');

        return newProduct;
    }

    async updateProduct(productId){

        const updateNest = updateNestedObjectParser(this);
        const objectParams = removeUndefinedObject(updateNest);
        if(objectParams.product_attributes){
            await updateProductByIdRepo({
                productId, 
                objectParams, 
                model : electronics
            });
        }

        const updateProduct = await super.updateProduct(productId, objectParams);
        return updateProduct;
    }
}

class Clothing extends Product{

    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop : this.product_shop
        });

        if(!newClothing) throw new BadRequestError('Error : Create not success clothing');

        const newProduct = await super.createProduct({ product_id : newClothing._id });

        if(!newProduct) throw new BadRequestError('Error : Create nto success Product');

        return newProduct;
    }

    async updateProduct(productId){

        const updateNest = updateNestedObjectParser(this);
        const objectParams = removeUndefinedObject(updateNest);
        if(objectParams.product_attributes){
            await updateProductByIdRepo({
                productId, 
                objectParams, 
                model : clothing
            });
        }

        const updateProduct = await super.updateProduct(productId, objectParams);
        return updateProduct;
    }
}

class Furniture extends Product{

    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop : this.product_shop
        });

        if(!newFurniture) throw new BadRequestError('Error : Create not success furniture');

        const newProduct = await super.createProduct({ product_id : newFurniture._id });

        if(!newProduct) throw new BadRequestError('Error : Create nto success Product');

        return newProduct;
    }

    async updateProduct(productId){

        const updateNest = updateNestedObjectParser(this);
        const objectParams = removeUndefinedObject(updateNest);
        if(objectParams.product_attributes){
            await updateProductByIdRepo({
                productId, 
                objectParams, 
                model : furniture
            });
        }

        const updateProduct = await super.updateProduct(productId, objectParams);
        return updateProduct;
    }
}


ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);


module.exports = ProductFactory;