
/**
 * Module dependencies.
 */
var express = require('express');
var fs = require('fs');
var prettyjson = require('prettyjson'); 
var util = require('util');  

//this provides namespace capabilities to express routes.
require('express-namespace');
   
// Load configurations
var config = require('./config/config');
var mongoose = require('mongoose');

//first, checks if it isn't implemented yet
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

util.log("");
util.log('configuration: ');
util.log(prettyjson.render(config));
util.log("");
util.log("process.env.NODE_ENV: " + process.env.NODE_ENV);  

// Bootstrap db connection
mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
});


//export the app variable, so it can be used in mocha tests.
var app = module.exports = express();

// express settings
require('./config/express')(app, config)

// Bootstrap routes
require('./config/routes')(app);

var server = app.listen(app.settings.port, function(){
  util.log(util.format("Express server listening on port: '%d' in '%s' mode", app.settings.port, app.settings.env));
});
