var app = require('../meanrpgclient')
  , sim = require('../../lib/calculation/roll-simulation');

var re = /\s*(\d+)d(\d+)\s?([+±−-]\d+)?(\*)?\s*/i;

function parseBonus(str) {
  if (str[0] === '+' || str[0] === '±') {
    return Number(str.substr(1));
  } else if (str[0] === '-' || str[0] === '−') {
    return -Number(str.substr(1));
  } else {
    return str;
  }
}

function formatBonus(adv) {
  if (isNaN(adv)) {
    return adv;
  }
  adv = Number(adv);
  if (adv < 0) {
    return adv.toString().replace('-', '−');
  } else if (adv === 0) {
    return '±0';
  } else  {
    return '+' + adv.toString();
  }
}

app.directive('roll', function() {
  return {
    restrict: 'A',
    scope: {roll: '@'},
    template: '<strong class="roll" title="{{min}} – {{max}} ({{mean}})">'+
              '{{rolls}}d{{die}}<span ng-if="bonus" ng-bind="bonus"></span>' +
              '<span ng-if="infinite">*</span></strong>',
    link: function(scope, el, attrs) {
      var match = re.exec(attrs.roll);
      if (match) {
        var rolls = Number(match[1])
          , die = Number(match[2]);

        var bonus = 0;
        if (match[3]) {
          bonus = parseBonus(match[3]);
        }
        var min = rolls + bonus;

        if (match[4]) {
          scope.infinite = true;
          var mean = rolls * sim.meanRoll(1, die) + bonus;
          scope.mean = mean.toFixed(1);
          // Normally, mean = min + (max-min)/2; since we have
          // mean but not max, let's just solve for max
          var max = (mean - min) * 2 + min;
          scope.max = max.toFixed(1) + '/∞';
        } else {
          scope.infinite = false;
          scope.mean = rolls + (rolls * (die-1))/2
          scope.max = rolls * die + bonus;
        }

        scope.rolls = rolls;
        scope.die = die;
        scope.min = min;
        if (bonus !== 0) {
          scope.bonus = formatBonus(bonus);
        }
      }
    }
  };
});
