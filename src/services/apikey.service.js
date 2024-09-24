'use strict'

const apiKeyModel = require('../models/apikey.model.js');
const crypto = require('crypto');

const findById = async ( key ) => {
  try{
    // const newKey = await apiKeyModel.create({ key : crypto.randomBytes(64).toString('hex'), permissions : ['0000']});

    const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
    return objKey;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  findById
}