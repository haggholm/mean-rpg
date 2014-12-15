'use strict';

var numeral = require('numeral');

function bracketify(zeroes) {
  return zeroes ? '[' + zeroes + ']' : '';
}

module.exports = {
  getPercentFormatter: function(sigFigs) {
    var a = '0[.]' + bracketify('0'.repeat(sigFigs-2))
      , b = '0[.]' + bracketify('0'.repeat(sigFigs-1))
      , c = '0[.]' + bracketify('0'.repeat(sigFigs));
    return function(percent) {
      //var exp = percent.toExponential(sigFigs-1);
      //var pieces = /(\d+(?:\.\d+)?)e([+-])(\d+)/;
      //var mantissa = pieces[1]
      //  , sign = pieces[2]
      //  , exponent = pieces[3];
      //return percent.toFixed()
      //
      //if (sign === '+') {
      //  var output = mantissa[0];
      //  for (var i = 1; i < sigFigs; i++) {
      //    output += mantissa[i+1];
      //  }
      //}

      var rounded = Number(percent.toPrecision(sigFigs));
      if (rounded >= 100) {
        return '100%';
      } else if (rounded >= 10) {
        return numeral(rounded).format(a) + '%';
      } else if (rounded >= 1) {
        return numeral(rounded).format(b) + '%';
      } else {
        return numeral(rounded).format(c) + '%';
      }
    };
  }
};
