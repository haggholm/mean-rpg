'use strict';

var ngModule = require('../RPG.Directives')
  , util = require('../util');

module.exports = ngModule.filter('percent',
  function() {
    return function(value, precision) {
      if (precision === undefined) {
        precision = 2;
      } else {
        precision = Number(precision);
      }
      return util.getPercentFormatter(precision)(Number(value));
    };
  });
