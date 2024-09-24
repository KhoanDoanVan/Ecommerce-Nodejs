const amqp = require('amqplib')

const messages = 'message product : Title abczs' // messages

const runProducer = async () => {
  try{
    const connection = await amqp.connect('amqp://localhost')

    const channel = await connection.createChannel()

    const queueName = 'test-topic'

    await channel.assertQueue(queueName, {durable : true})

    // send messages to consumer channel
    channel.sendToQueue(queueName, Buffer.from(messages))
    console.log(`message send ::`, messages)

  } catch(error){
    console.error(`Error runProducer`, error)
  }
}

runProducer().catch(console.error)