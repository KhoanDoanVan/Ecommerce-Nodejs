'use strict'

const redis = require('redis')
const { promisify } = require('util')
const { reservationInventory } = require('../models/repositories/inventory.repo.js')

const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

// OPTIMISTIC LOCK
const acquireLock = async ( productId, quantity, cartId ) => {
  const key = `lock_v2023_${productId}`
  const retryTimes = 10
  const expireTime = 3000 // 3 seconds

  for(let i = 0; i < retryTimes; i++){
    //create 1 key, who hold it will be order
    const result = await setnxAsync(key, expireTime)

    if(result === 1){
      //action with inventory
      const isReservation = await reservationInventory({
        productId, quantity, cartId
      })

      if(isReservation.modifiedCount){
        await pexpire(key, expireTime)

        return key
      }

      return null

    } else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

  }
}

// const releaseLock = async keyLock => {
//   const delAsyncKey = promisify(redisClient.del).bind(redisClient)

//   return await delAsyncKey(keyLock)
// }


const releaseLock = async keyLock => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);

  try {
    return await delAsyncKey.call(redisClient, keyLock); // Ensure 'this' context is set to redisClient
  } catch (err) {
    console.error('Error releasing lock:', err);
    throw err; // Throw the error for handling further up the call stack
  }
};

module.exports = {
  acquireLock,
  releaseLock
}