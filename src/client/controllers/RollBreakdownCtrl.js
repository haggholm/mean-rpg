'use strict';

var app = require('../app')
  , d3 = require('d3-browserify')
  , simdata = require('../../data/rolls.processed.json');


var WIN_KEY = '% wins'
  , DRAW_KEY = '% draws'
  , LOSS_KEY = '% lost';


module.exports = app.controller('RollBreakdownCtrl', function($scope){
  $scope.meanRoll = simdata.meanRoll;
  $scope.oddsVsAdvantageData = simdata.oddsVsAdvantageData;
  $scope.oddsVsAdvantageDataNoDraw = simdata.oddsVsAdvantageDataNoDraw;

  var colourMap = {};
  var saturation = 2/3, lightness = 0.5;
  colourMap[WIN_KEY] = d3.hsl(110, saturation, lightness);
  colourMap[DRAW_KEY] = d3.hsl(37, saturation, lightness);
  colourMap[LOSS_KEY] = d3.hsl(2, saturation, lightness);
  $scope.getColour = function(v) {
    return colourMap[v.key];
  };

  function formatAdvantage(adv) {
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
  function formatPercentage(pct) {
    if (isNaN(pct)) {
      return pct;
    } else {
      pct = Number(pct);
      return pct === 100 ? '100%' : pct.toPrecision(2) + '%';
    }
  }
  $scope.formatYTick = formatPercentage;
  $scope.formatXTick = formatAdvantage;

  var descMap = {};
  descMap[WIN_KEY] = 'winning';
  descMap[DRAW_KEY] = 'drawing';
  descMap[LOSS_KEY] = 'losing';
  $scope.mkTooltip = function(key, x, y/*, e, graph*/) {
    // key === type
    // y === percentage
    var advantage = Number(x.replace('−', '-').replace('±', ''));
    return(
      '<div class="tooltip-inner" ' +
      'style="display:inline-block;max-width:100%;">' +
      '<p>With a <strong>' +
      formatAdvantage(advantage) + '</strong>' +
      (advantage < 0 ? ' disadvantage, ' : ' advantage, ') +
      'there is a <strong>' +
      formatPercentage(y) + '</strong> chance of ' + descMap[key] +
      '</p></div>'
    );
  };
});
