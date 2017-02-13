"use strict";

require('dotenv').load();

// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser'); // parse requests to JSON
const methodOverride = require('method-override');
const logger = require('morgan'); // log-in incoming requests framework
const app = express();
const path = require('path');
const fs = require('fs');
const router = require('./router');
const cors = require('cors');
const errorHandler = require('errorhandler');

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(__dirname + '/access.log',{flags: 'a'});

// App Setup - middleware
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, '/views/css')));
app.use(cors()); // accept all requests

// development only
if ('development' == app.get('env')) {
	app.use(logger('combined', {stream: accessLogStream}));
    app.use(errorHandler());
}

router(app);

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
