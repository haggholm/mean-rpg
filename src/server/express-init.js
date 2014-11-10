// jshint node:true
'use strict';

var bodyParser = require('body-parser'),
    chalk = require('chalk'),
    compress = require('compression'),
	  express = require('express'),
    glob = require('glob'),
    helmet = require('helmet'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    path = require('path'),
    session = require('express-session'),
	  mongoStore = require('connect-mongo')({
      session: session
    });

var config = require('./config'),
	  paths = require('./paths');

function info(txt) {
  console.info(chalk.green(txt));
}

function debug(txt) {
  console.info(chalk.blue(txt));
}

module.exports = function(db) {
  var app = express();

	app.set('showStackError', true);

  info('Loading models...');
  glob.sync(paths.lib('models/*.js')).forEach(function(pth){
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
  app.set('views', paths.server('views'));
	app.set('view engine', 'mustache'); // Template extension .mustache
  app.set('layout', paths.server('layout'));
  // Handler for extension .mustache
  app.engine('mustache', require('hogan-express'));


  // Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride()); // Allow HTTP method overrides

  // Session management
  info('Initializing session management');
  app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: 'dev', //config.sessionSecret,
		store: new mongoStore({
			db: db.connection.db,
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

  // Assume 'not found' in the error msgs is a 404. this is somewhat silly,
  // but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();

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
  return app;
};
