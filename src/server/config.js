'use strict';

var path = require('path');

module.exports = {
  debug: true,
  db: {
    host: 'localhost',
    database: 'mean-rpg',
    options: {
      //user: 'petter',
      //pass: 'petter'
    }
  },
  port: 9001,
  paths: {
    lib: function(pth) {
      return path.resolve(path.relative('.', __dirname + '/../lib/' + pth));
    },
    server: function(pth) {
      return path.resolve(path.relative('.', __dirname + '/' + pth));
    }
  }
};

