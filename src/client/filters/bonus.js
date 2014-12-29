'use strict';

var _ = require('lodash')
  , ngModule = require('../RPG.Filters');


module.exports = ngModule.filter('bonus',
  function() {
    return _.memoize(function(value) {
      if (isNaN(value)) {
        return value;
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
    });
  });
