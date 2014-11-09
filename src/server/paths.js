//jshint node: true
'use strict';

var path = require('path');

module.exports = {
  lib: function(pth) {
    return path.resolve(path.relative('.', __dirname + '/../lib/' + pth));
  },
  server: function(pth) {
    return path.resolve(path.relative('.', __dirname + '/' + pth));
  }
};
