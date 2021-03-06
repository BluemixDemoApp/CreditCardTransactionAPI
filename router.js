"use strict";

const Endpoint = require('./controllers/endpoint');

module.exports = function(app) {

  app.get('/health', function(req, res) {
    return res.sendStatus(200);
  });

  app.post('/createUser', Endpoint.createUser); 
  app.post('/createTransaction', Endpoint.createTransaction); 
  app.get('/checkTransaction/:transactionId', Endpoint.checkTransaction); 
  app.get('/getTransactions/:userId', Endpoint.getTransactions); 
  app.get('/getUsers', Endpoint.getUsers); 

  app.get('/sms', Endpoint.getSMS); 

  // Home (default url in case of error)
  app.get('*', function(req, res) {
    res.render('index.html', { title: 'Transaction App' });
  }); 

};
