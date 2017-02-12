"use strict";

// Main starting point of the application
require('dotenv').load();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser'); // parse requests to JSON
const morgan = require('morgan'); // log-in incoming requests framework
const app = express();
const fs = require('fs');
const router = require('./router');
const cors = require('cors');
const env = process.env;

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(__dirname + '/access.log',{flags: 'a'});

// App Setup - middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('combined', {stream: accessLogStream}));
app.use(cors()); // accept all requests
app.use(bodyParser.json({ type: '*/*' }));
router(app);

const nodePort = env.NODE_PORT || 3000;
const nodeIp = env.NODE_IP || 'localhost';

// Server Setup
const server = http.createServer(app);
server.listen(nodePort, nodeIp, function () {
  console.log(`Application worker ${process.pid} started...`);
  console.log(`IP: ${nodeIp} PORT: ${nodePort}`);
});
