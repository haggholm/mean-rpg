// jshint node:true
'use strict';

var bodyParser = require('body-parser'),
    chalk = require('chalk'),
    compress = require('compression'),
	  express = require('express'),
    glob = require('glob'),
    debug = require('debug'),
    helmet = require('helmet'),
    logger = require('morgan'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    path = require('path'),
    session = require('express-session'),
	  mongoStore = require('connect-mongo')({
      session: session
    });

var config = require('./config');

function info(txt) {
  console.info(chalk.green(txt));
}

function debug(txt) {
  console.info(chalk.blue(txt));
}

//CORS middleware
var allowCORS = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');//http://localhost:9000');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Accept,Origin,Content-Type');

  next();
};

module.exports = function(db) {
  var app = express();

	app.set('showStackError', true);

  app.use(logger('combined', {
    stream: process.stdout
  }));

  info('Loading models...');
  glob.sync(config.paths.lib('models/*.js')).forEach(function(pth){
    debug('  ' + path.relative('.', pth));
    require(pth);
  });

	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Set views path and view engine
  app.set('views', config.paths.server('views'));
	app.set('view engine', 'mustache'); // Template extension .mustache
  app.set('layout', config.paths.server('layout'));
  // Handler for extension .mustache
  app.engine('mustache', require('hogan-express'));


  // Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride()); // Allow HTTP method overrides

  app.use(allowCORS);
  app.options("*", function(req,res,next){
    res.sendStatus(200);
  });

  // Session management
  info('Initializing session management');
  app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: 'dev', //config.sessionSecret,
		store: new mongoStore({
			mongooseConnection: db.connection,
			collection: 'sessions' //config.sessionCollection
		})
	}));
  app.use(passport.initialize());
	app.use(passport.session());


  // Security fixes
  info('Putting on Helmet');
  app.use(helmet());

  info('Loading routes...');
  require('./routes')(app);

  app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) { return next(); }

		// Log it
		console.error(err.stack);

		// Error page
		res.status(500).render('500', {
			error: err.stack
		});
	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).render('404', {
      title: 'Quoth the raven, “404!”',
			url: req.originalUrl,
			error: 'Not Found'
		});
	});

  info('Express initialization complete');

  if (config.debug && 0) {
    info('Debug mode: Launching livereload server...');
    require('express-livereload')(app, {
      port: 35739, // Not the same as Gulp will occupy!
      watchDir: config.paths.server('../')
    });
  }

  return app;
};
