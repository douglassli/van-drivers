'use strict';

var express = require('express'),
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    mainRouter = require('./routers/mainRouter');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(mainRouter);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


var mongoUri = 'mongodb://localhost';
console.log('Connecting to MongoDB at ' + mongoUri);
mongoose.Promise = Promise;
mongoose.connect(mongoUri);