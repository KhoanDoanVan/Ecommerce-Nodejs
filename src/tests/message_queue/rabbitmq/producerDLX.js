'use strict'

const amqp = require('amqplib')

const log = console.log

console.log = function() {
  log.apply(console, [new Date()].concat(arguments))
}

const runProducer = async () => {
  try{
    const connection = await amqp.connect('amqp://localhost')

    const channel = await connection.createChannel()

    const notificationExchange = 'notificationEx' // notification Exchange Direct
    const notiQueue = 'notificationQueueProcess' // assertQueue
    const notificationExchangeDLX = 'notificationExDLX' // notification Exchange Direct DLX
    const notificationRoutingKeysDLX = 'notificationRoutingKeysDLX' // assertRouting


    // 1. create exchange
    await channel.assertExchange(notificationExchange, 'direct', {durable : true})

    // 2. create Queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive : false, // allow all consumers get message in same time
      deadLetterExchange : notificationExchangeDLX,
      deadLetterRoutingKey : notificationRoutingKeysDLX
    })

    // 3. bindQueue
    await channel.bindQueue(queueResult.queue, notificationExchange)

    // 4. send message
    const msg = 'a new product'
    console.log(`producer msg::`, msg)
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg),{
      expiration : '10000'
    })


  } catch(error){
    console.error(error)
    throw error
  }
}