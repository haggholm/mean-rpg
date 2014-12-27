'use strict';

var ngModule = require('../RPG.Filters');
module.exports = ngModule.filter('bonus',
  function() {
    return function(value) {
      if (isNaN(value)) {
        return '?';
      } else {
        var v = Number(value);
        if (v > 0) {
          return value;
        } else if (v < 0) {
          return '−' + (-v);
        } else {
          return '±0';
        }
      }
    };
  });
