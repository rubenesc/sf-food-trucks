/**
 * Module dependencies.
 */

var express = require('express'),
    favicon = require('serve-favicon'),
    flash = require('connect-flash'),
    util = require('util'),
    logger = require('morgan'),
    mongoStore = require('connect-mongo')(express),
    expressValidator = require('express-validator'),
    exphbs  = require('express3-handlebars');


module.exports = function(app, config) {

  app.configure(function() {

    process.env.PORT = config.httpPort || process.env.PORT || 3000;

    app.set('port', process.env.PORT);
    app.set('showStackError', true);

    // should be placed before express.static
    app.use(express.compress({
      filter: function(req, res) {
        console.log(res.getHeader('Content-Type'));
        return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
      },
      level: 9 
    }));

    //Set response headers
    app.use(function(req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      return next();
    });

   app.use(favicon(__dirname + '/../webapp/images/favicon.ico'));

    //handlebars
    app.engine('handlebars', exphbs({defaultLayout: 'main'}));
    
    //app.set('views', config.root + '/app/views');
    app.set('view engine', 'handlebars');

    //setup logging
    if (app.get('env') !== 'development') {
        app.use(logger({}));
    } else {
        app.use(logger('dev'));
    }

    // limit the size of the request body depending on the content type.
    app.use(type('application/x-www-form-urlencoded', express.limit('64kb')));
    app.use(type('application/json', express.limit('1mb')));
    app.use(type('image', express.limit('3mb')));
    app.use(type('video', express.limit('5mb')));

    // bodyParser should be above methodOverride
    app.use(express.bodyParser());
    app.use(expressValidator);      
    app.use(express.methodOverride());

    // cookieParser should be above session
    app.use(express.cookieParser());

    // express/mongo session storage
    app.use(express.session({
      secret: config.sessionSecret,
      store: new mongoStore({
        url: config.db,
        collection: 'sessions'
      })
    }));

    // connect flash for flash messages
    app.use(flash());

    //compile coffee script or javascript out of an assets directory.
    app.use(require('connect-assets')());

    // routes should be at the last
    app.use(app.router);

    // sets up the public directory to use static files
    app.use(express.static(config.root + '/webapp'));
    util.debug("static: ["+config.root + '/webapp'+"]");

    //Error handling - after the router
    //http://expressjs.com/guide.html#error-handling
    app.use(logErrors);

    //handle errors
  app.use(function(err, req, res, next) {

      if (err) {
        return res.send('500', {error: err});
      }

      //the next handler is the 404.
      next();

  });

  // assume 404 since no middleware responded
  app.use(function(req, res, next) {

      return res.render('404', {
        message: "not found ...",
        url: req.url
      });

    });

  });

  app.configure('development', function() {

    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));

  });

  app.configure('test', function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    app.set('port', 3001);
  });

  app.configure('production', function() {
    app.use(express.errorHandler());
  });

}


//Wrap multiple limit() middleware based on the Content-Type of the request
function type(type, fn) {

  return function(req, res, next){

    var ct = req.headers['content-type'] || '';
    if (0 != ct.indexOf(type)) {
      return next();
    }
      
    fn(req, res, next);
  }

}



//refactor get move this somewhere else
function logErrors(err, req, res, next) {

  //I dont want to log any ValidationErrors
  if (err){

    if (err.stack){
      util.error("--server error stack --> " + err.stack);
    } else {
      if (err.message){
        util.error("--server error message --> " + err.message);
      }
    }

  }

  next(err);
}

