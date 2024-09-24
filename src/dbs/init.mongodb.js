'use strict'

const mongoose = require('mongoose');

const {db} = require('../configs/config.mongodb.js');


const connectString = `${db.http}://${db.name}:${db.password}.${db.domain}.mongodb.net/${db.hash}`;


class Database {

    constructor(){
        this.connect();
    }

    connect(type = 'mongodb'){

        // if(1 == 1){
        //     mongoose.set('debug', true);
        //     mongoose.set('color', true);
        // }

        mongoose.connect(connectString/*, maxPoolSize : 50*/).then( _ => console.log(`Mongodb Success Port::${connectString} !!!`))
            .catch( err => console.log(err));
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;