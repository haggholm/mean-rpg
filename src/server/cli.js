'use strict';


var chalk = require('chalk')
  , q = require('q')
  , User = require('../lib/models/User');


module.exports = function(args/*, app*/) {
  if (args.user) {
    User.findOneQ({username: args.user})
      .then(function(user) {
        if (user) {
          console.log(chalk.green('Found user: '+args.user));
          return q(user);
        } else if (args.create) {
          console.log(chalk.green('No such user ('+args.user+'); creating...'));
          return (new User({
            username: args.user,
            password: args.password,
            email: args.email,
            provider: 'default',
            roles: ['user'].concat(args.admin ? ['admin'] : [])
          })).saveQ();
        } else {
          throw {message: 'No such user: '+args.user};
        }
      }).then(function(user){
        user.changePassword(args.pass);
        if (args.email) {
          user.email = args.email;
        }
        return user.saveQ();
      }).then(function(user){
        console.log(chalk.green(
          'User '+user.username+' was successfully updated'));
        process.exit(0);
      })
      .catch(function(err){
        console.log(chalk.red(err.message));
        process.exit(1);
      }).done();
  }
};
