'use strict'

const Redis = require('redis')

class RedisPubSub {

  constructor(){
    this.subscriber = Redis.createClient()
    this.publisher = Redis.createClient()
  }

    async publish(channel, message) {
      try{
        await this.publisher.publish(channel, message);
      } catch(err){
        throw err
      }
    }


    subscribe(channel, callback){
      this.subscriber.subscribe(channel)
      this.subscriber.on('message', ( subscriberChannel, message ) => {
        if(channel === subscriberChannel){
          callback(channel, message)
        }
      })
    }
}

module.exports = new RedisPubSub()