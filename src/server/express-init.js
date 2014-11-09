'use strict';

var bodyParser = require('body-parser'),
    chalk = require('chalk'),
    compress = require('compression'),
	  express = require('express'),
    glob = require('glob'),
    helmet = require('helmet'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    session = require('express-session'),
	  mongoStore = require('connect-mongo')({
      session: session
    }),
    config = require('./config'),
	  path = require('path'),
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
//  glob.sync('./**').forEach(function(err, pths) {
//    debug(JSON.stringify(arguments));
//    debug('Globbbb: '+pths);
//  });
  info(paths.lib('models/*.js'));
  glob.sync(paths.lib('models/*.js')).forEach(function(pth){
    require(path.resolve(pth));
    debug('Glob: '+pth);
    require(pth);
  });
  info('hm');

	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));


  require('hogan');
  app.engine('html.mustache', require('hogan-express'));

	// Set views path and view engine
  app.set('views', paths.server('views'));
	app.set('view engine', 'html.mustache');
//  app.use(express.static(paths.server('views/**')));


  // Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride()); // Allow HTTP method overrides

  // Session management
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
  app.use(helmet());

  require('./routes');

  // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
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
			url: req.originalUrl,
			error: 'Not Found'
		});
	});

  return app;
};
