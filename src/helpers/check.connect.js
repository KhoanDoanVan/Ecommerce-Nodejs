'use strict';

const mongoose = require('mongoose');
const process = require('process');
const os = require('os');

const _SECOND = 5000;

// Count Connection
const countConnection = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections::${numConnection}`);
}

// Check Overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    const maxConnection = numCores * 5;

    console.log(`Active connection::${numConnection}`);
    console.log(`Memory usage::${memoryUsage / 1024 / 1024} MB`);

    if(numConnection > maxConnection){
      console.log('Connection overload detected !');
    }
  }, _SECOND);
}

module.exports = {
  countConnection,
  checkOverload
}