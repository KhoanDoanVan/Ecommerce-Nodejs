require('dotenv').config(); // define for use env file

const express = require('express');
const morgan = require('morgan');
const {default : helmet} = require('helmet');
const compression = require('compression');

const app = express();

//------ init middlewares ------
app.use(morgan('dev'));
/*
  morgan('combined');
  morgan('common');
  morgan('short');
  morgan('tiny');
*/
app.use(helmet()); // miss head curl
app.use(compression());  // decrease data x100 request
app.use(express.json());
app.use(express.urlencoded({
  extended : true
}))

//------ init route ------
app.use('/', require('./routes/index.js'))

//----- test---------
// require('./tests/inventory.test.js')
// const productTest = require('./tests/product.test.js')
// productTest.purchaseProduct("newIDproduct:001", 10)

//------ handle error ------

app.use((req, res, next) => { // middleware
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})


app.use((error, req, res, next) => { // handle error
  const statusCode = error.status || 500;

  return res.status(statusCode).json({
    code : 'error',
    status : statusCode,
    message : error.message || 'Internal Server Error',
    error : error.stack
  })
})



require('./dbs/init.mongodb.js');

module.exports = app;