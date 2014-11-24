'use strict';


var chalk = require('chalk')
  , q = require('q')
  , fs = require('fs')
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

  if (args.sim) {
    // megaIters -> error
    //    1 -> 0.044  (% pts)
    //   10 -> 0.018  (% pts)
    //   50 -> 0.0087 (% pts)    58s/adv
    //  100 -> 0.0058 (% pts)   112s/adv
    // 1000 -> 0.001  (% pts)  1134s/adv.
    var megaIters = 50;
    var data = require('../lib/calculation/roll-simulation')(megaIters);
    console.log(chalk.blue(Math.abs(data.stats[0].wins - data.stats[0].losses)));
    if (typeof(args.sim) === 'string') {
      fs.writeFile(args.sim, JSON.stringify(data),
        function(err) {
          if (err) {
            console.log(chalk.red(err));
            process.exit(1);
          } else {
            process.exit(0);
          }
        });
    } else {
      console.log(chalk.yellow(JSON.stringify(data, null, '  ')));
      process.exit(0);
    }
  }
};
