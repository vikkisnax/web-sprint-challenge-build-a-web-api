// add middlewares here related to actions
const Actions = require('./actions-model')

function logger(req, res, next) {
    console.log('logger mw:', logger);
    const timestamp = new Date().toLocaleString()
    // method - get,put, etc. are inside req.method
    const method = req.method
    // url - can find it in many places, one way below
    const url = req.originalUrl
    console.log(`[${timestamp} ${method} to ${url}]`)
    next()
  }


  module.exports = {
    logger,
  }