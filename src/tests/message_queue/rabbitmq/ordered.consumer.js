'use strict'

const amqp = require('amqplib')

async function consumerOrderedMessage(){
  const connection = await amqp.connect('amqp://localhost')

  const channel = await connection.createChannel()

  const queueName = 'ordered-queue-message'

  // if did not used prefetch
  // ordered-queue-message::${4}
  // ordered-queue-message::${5}
  // ordered-queue-message::${1}
  // ordered-queue-message::${2}
  // ordered-queue-message::${3}
  // ordered-queue-message::${0}

  // set prefetch for force all consumer will patch message in the same time
  channel.prefetch(1)

  // after used prefetch
  // ordered-queue-message::${0}
  // ordered-queue-message::${1}
  // ordered-queue-message::${2}
  // ordered-queue-message::${3}
  // ordered-queue-message::${4}
  // ordered-queue-message::${5}

  await channel.consume(queueName, msg => {
    const message = msg.content.toString()

    setTimeout(() => {
      console.log('processed:', message)
      channel.ack(msg)
    }, Math.random() * 1000)
  })

}

consumerOrderedMessage().catch(err => console.error(`Error consumerOrderedMessage:`, err))