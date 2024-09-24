'use strict'

const { 
  Client, 
  GatewayIntentBits 
} = require('discord.js')

const {
  CHANNELID_DISCORD,
  TOKEN_BOT_DISCORD
} = process.env

class DiscordLogService{
  constructor(){
    this.client = new Client({
      intents : [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })

    this.channelID = CHANNELID_DISCORD

    this.tokenBot = TOKEN_BOT_DISCORD

    this.client.on('ready', () => {
      console.log(`Logged Discord at ${this.client.user.tag} !!!`)
    })

    this.client.login(this.tokenBot)

  }

  sendToFormatCode(logData){
    const { code , message = 'This is information code', title = 'Code example' } = logData

    const codeMessage = {
      content : message,
      embeds : [
        {
          color : parseInt('00ff00', 16), // Convert hexadecimal color code to integer
          title,
          description : '```json\n' + JSON.stringify(code ,null, 2) + '\n```',
        },
      ]
    }

    this.sendToMessage(codeMessage)
  }

  sendToMessage( message = 'message' ){
    const channel = this.client.channels.cache.get(this.channelID)

    if(!channel){
      console.error(`Counldn't found channel`, channel)
      return
    }

    channel.send(message).catch(e => console.error(e))
  }
}



module.exports = new DiscordLogService()

// 'use strict'

// const { Client , GatewayIntentBits } = require('discord.js')

// const client = new Client({
//   intents : [
//     GatewayIntentBits.DirectMessages,
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages,
//     GatewayIntentBits.MessageContent
//   ]
// })

// client.on('ready', () => {
//   console.log(`Logged is as ${client.user.tag} !`)
// })

// const token = 'MTE4NDA5MTYwNzIzNTA0MzM1OA.GAPceX.Cu1c04beIOZkeYU6ADztOpOmW_IWFHEbJt57qg'

// client.login(token)

// client.on('messageCreate', msg => {
//   if(msg.content === 'hello'){
//     msg.reply('Hello ! I so happy for you return here <3')
//     console.log('client message success')
//   }
// })