'use strict';

var chalk = require('chalk')
  , mongoose = require('mongoose')
  , yargs = require('yargs');

var config = require('./config');

var db = mongoose.connect(
  config.db.host,
  config.db.database,
  config.db.port,
  config.db.options,
  function(err) {
    if (err) {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(chalk.red(err));
    } else {
      console.info('Connected to MongoDB');
    }
  });


var app = require('./app')(db);

var args = yargs
  .usage('main [--user USER --pass PASSWORD [--create --email EMAIL]] [--sim]')
  .alias('u', 'user')
  .alias('p', 'pass')
  .implies('user', 'pass')
  .implies('create', 'email')
  .argv;

if (args.user || args.sim) {
  require('./cli')(args, app);
} else {
  // Bootstrap passport config
  //require('./config/passport')();

  // Start the app by listening on <port>
  app.listen(config.port);

  // Expose app
  module.exports = module.exports = app;

  // Logging initialization
  console.log('MEAN.JS application started on port ' + config.port);
}
