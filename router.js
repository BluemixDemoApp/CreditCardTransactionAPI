"use strict";

const Endpoint = require('./controllers/endpoint');

module.exports = function(app) {

  // Home
  app.get('/', function (req, res){
      res.sendfile('index.html');
  });

  app.get('/health', function(req, res) {
    return res.sendStatus(200);
  });

  app.post('/createUser', Endpoint.createUser); 
  app.post('/createTransaction', Endpoint.createTransaction); 
  app.get('/checkTransaction/:transactionId', Endpoint.checkTransaction); 
  app.get('/getTransactions/:userId', Endpoint.getTransactions); 
};
