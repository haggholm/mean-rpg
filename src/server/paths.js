'use strict';

module.exports = {
  lib: function(pth) {
    return __dirname + '/../lib/' + pth;
  },
  server: function(pth) {
    return __dirname + '/' + pth;
  }
};
