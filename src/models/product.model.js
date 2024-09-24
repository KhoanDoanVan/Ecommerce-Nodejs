'use strict'

const {model , Schema} = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';


const productSchema = new Schema({
  product_slug : String,
  product_name : {type : String, required : true},
  product_thumb : {type : String, required : true},
  product_description : String,
  product_price : {type : Number, required : true},
  product_quantity : {type : String, required : true},
  enum : ['Electronics', 'Clothing', 'Furniture'],
  product_shop : {type : Schema.Types.ObjectId, ref : 'Shop'},
  product_attributes : {type : Schema.Types.Mixed, required : true},
  //more
  product_ratingsAverage : {
    type : Number,
    default : 4.5,
    min : [1, 'Rating be must above 1'],
    max : [5, 'Rating be must below 5'],
    set : (val) => Math.round(val * 10) / 10
  },
  product_variations : {type : Array, default : []},
  isDraft : {type : Boolean, default : true, index : true, select : false},
  isPublished : {type : Boolean, default : false, index : true, select : false}
}, {
  collection : COLLECTION_NAME,
  timestamps : true
})

// Set index
productSchema.index({ 
  product_name : 'text' , 
  product_description : 'text' 
});

//Document middleware runs before save() or create()...
productSchema.pre('save', function( next ){
  this.product_slug = slugify(product_name, {lower : true});
  next();
})


//Scheme SubProduct
const clothingScheme = new Schema({
  brand : {type : String, required : true},
  size : String,
  material : String,
  product_shop : { type : Schema.Types.ObjectId, ref : 'Shop' }
}, {
  collection : 'clothes',
  timestamps : true
})

const electronicSchema = new Schema({
  manufaturer : {type : String, required : true},
  model : String,
  color : String,
  product_shop : { type : Schema.Types.ObjectId, ref : 'Shop' }
}, {
  collection : 'electronics',
  timestamps : true
})

const furnitureSchema = new Schema({
  brand : { type : String, required : true},
  size : String,
  material : String,
  product_shop : { type : Schema.Types.ObjectId, ref : 'Shop' }
}, {
  collection : 'furnitures',
  timestamps : true
})

module.exports = {
  product : model(DOCUMENT_NAME, productSchema),
  electronics : model( 'Electronics', electronicSchema),
  clothing : model('Clothing', clothingScheme),
  furniture : model('Furniture', furnitureSchema)
}