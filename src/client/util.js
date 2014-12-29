'use strict';

var _ = require('lodash')
  , numeral = require('numeral');

function bracketify(zeroes) {
  return zeroes ? '[' + zeroes + ']' : '';
}

module.exports = {
  getPercentFormatter: _.memoize(function(sigFigs) {
    var a = '0[.]' + bracketify('0'.repeat(sigFigs-2))
      , b = '0[.]' + bracketify('0'.repeat(sigFigs-1))
      , c = '0[.]' + bracketify('0'.repeat(sigFigs));
    return _.memoize(function(percent) {
      try {
        var rounded = Number(percent.toPrecision(sigFigs));
        if (rounded >= 100) {
          return '100%';
        } else if (rounded >= 10) {
          console.log(a);
          return numeral(rounded).format(a) + '%';
        } else if (rounded >= 1) {
          console.log(b);
          return numeral(rounded).format(b) + '%';
        } else {
          console.log(c);
          return numeral(rounded).format(c) + '%';
        }
      } catch(e) {
        console.error(e);
        return '?';
      }
    });
  })
};
