'use strict'

const HEADER = {
  API_KEY : 'x-api-key',
  AUTHORIZATION : 'authorization'
}

const {findById} = require('../services/apikey.service.js');

const apiKey = async (req, res, next) => {
  try{
    const key = req.headers[HEADER.API_KEY]?.toString();

    if(!key){
      return res.status(403).json({
        message : 'Forbidden Error'
      })
    }

    // check objKey
    const objkey = await findById(key);

    if(!objkey){
      return res.status(403).json({
        message : 'Forbidden Error'
      })
    }

    req.objkey = objkey;
    return next(); // transform to next router

  } catch (err) {
    console.log(err);
  }
}


const permission = (permission) => {  // exp : permission = '0000'
  return (req, res, next) => {
    if(!req.objkey.permissions){
      return res.status(403).json({
        message : 'permission is denied'
      })
    } 

    const validPermisson = req.objkey.permissions.includes(permission);

    if(!validPermisson){
      return res.status(403).json({
        message : 'permission is denied'
      }) 
    }

    return next();
  }
}



module.exports = {
  apiKey,
  permission
}