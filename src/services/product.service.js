'use strict'

const {product, electronics, clothing} = require('../models/product.model.js');
const {BadRequestError} = require('../core/error.response.js');


class ProductFactory{

    static async createProductFactory( type, payload ){

        switch(type){
            case 'Electronics':
                return new Electronics(payload).createElectronic();
            case 'Clothing':
                return new Clothing(payload).createClothing();
            default :
                throw new BadRequestError(`Error : Create Product Type ${type} not success !!!`);
        }
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

    async createProduct({ product_id }){
        return await product.create({
            ...this,
            _id : product_id
        });
    }
}

class Electronics extends Product{

    async createElectronic(){
        const newElectronic = await electronics.create({
            ...this.product_attributes,
            product_shop : this.product_shop
        });

        if(!newElectronic) throw new BadRequestError('Error : Create not success electronic');

        const newProduct = await super.createProduct({ product_id : newElectronic._id });

        if(!newProduct) throw new BadRequestError('Error : Create nto success Product');

        return newProduct;
    }
}

class Clothing extends Product{

    async createClothing(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop : this.product_shop
        });

        if(!newClothing) throw new BadRequestError('Error : Create not success clothing');

        const newProduct = await super.createProduct({ product_id : newClothing._id });

        if(!newProduct) throw new BadRequestError('Error : Create nto success Product');

        return newProduct;
    }
}

module.exports = ProductFactory;