const amqp = require('amqplib')

const runConsumer = async () => {
  try{
    const connection = await amqp.connect('amqp://localhost')

    const channel = await connection.createChannel()

    const queueName = 'test-topic'

    await channel.assertQueue(queueName, {durable : true})

    // receive messages to consumer channel
    channel.consume(queueName, msg => {
      console.log(`Recieved message ${msg.content.toString()}`)
    },{
      noAck : true
    })

  } catch(error){
    console.error(`Error runProducer`, error)
  }
}

runConsumer().catch(console.error)