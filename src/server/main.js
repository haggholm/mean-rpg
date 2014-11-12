'use strict';

var chalk = require('chalk'),
    mongoose = require('mongoose');

var config = require('./config');

var db = mongoose.connect(config.db.host, config.db.database, config.db.options,
  function(err) {
    if (err) {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(chalk.red(err));
    } else {
      console.info('Connected to MongoDB');
    }
  });


var app = require('./express-init')(db);

// Bootstrap passport config
//require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
module.exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
