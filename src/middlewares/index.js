'use strict'

const Logger = require('../loggers/discord.log.js')

const sendToLoggerDiscord = ( req, res, next ) => {
    try{

        // Logger.sendToMessage(`Message Logger Success , Happy !!!`)

        Logger.sendToFormatCode({
            title : `Method : ${req.method}`,
            code : req.method === 'GET' ? req.query : req.body,
            message : `${req.get('host')} ${req.originalUrl}`
        })


        return next()
    } catch(error) {
        next(error)
    }
}

module.exports = {
    sendToLoggerDiscord
}