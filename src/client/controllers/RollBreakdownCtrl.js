'use strict';

var app = require('../meanrpgclient')
  , _ = require('lodash')
  , d3 = require('d3')
  , simdata = require('../rolls.json');


var cmp = function(a, b) {
  var x = a[0], y = b[0];
  return x === y ? 0 : (x < y ? -1 : +1);
};

var WIN_KEY = '% wins'
  , DRAW_KEY = '% draws'
  , LOSS_KEY = '% lost';

function mirror(wins, draws, losses) {
  var wins2 = new Array(wins.length * 2 - 1)
    , draws2 = new Array(wins.length * 2 - 1)
    , losses2 = new Array(wins.length * 2 - 1);
  var mid = wins.length-1;
  for (var i = wins.length-1; i > 0; i--) {
    var adv = wins[i][0]
      , w = wins[i][1]
      , d = draws[i][1]
      , l = losses[i][1];
    wins2[mid+i]   = [+adv, w];
    wins2[mid-i]   = [-adv, l];
    draws2[mid+i]  = [+adv, d];
    draws2[mid-i]  = [-adv, d];
    losses2[mid+i] = [+adv, l];
    losses2[mid-i] = [-adv, w];
  }
  wins2[mid] = wins[0];
  draws2[mid] = draws[0];
  losses2[mid] = losses[0];
  return [wins2, draws2, losses2];
}

function formatData(simdata, noDraws) {
  var wins = []
    , draws = []
    , losses = [];
  _.forOwn(simdata, function(value, key) {
    var advantage = Number(key);

    if (noDraws) {
      var total = value.wins + value.draws + value.losses
        , w = value.wins
        , d = value.draws
        , l = value.losses
        , wRatio = w / total;
      wins.push([advantage, w + d * wRatio]);
      draws.push([advantage, 0]);
      losses.push([advantage, l + d * (1-wRatio)]);
    } else {
      wins.push([advantage, value.wins]);
      draws.push([advantage, value.draws]);
      losses.push([advantage, value.losses]);
    }
  });
  wins.sort(cmp);
  draws.sort(cmp);
  losses.sort(cmp);

  var finalData;
  if (wins[0][0] === 0) {
    finalData = mirror(wins, draws, losses);
  } else {
    finalData = [wins, draws, losses];
  }
  return [
    { key: WIN_KEY, values: finalData[0] },
    { key: DRAW_KEY, values: finalData[1] },
    { key: LOSS_KEY, values: finalData[2] }
  ];
}

var oddsVsAdvantageData
  , oddsVsAdvantageDataNoDraw;

module.exports = app.controller('RollBreakdownCtrl', function($scope){
  $scope.meanRoll = simdata.meanRoll;

  if (oddsVsAdvantageData === undefined) {
    oddsVsAdvantageData = formatData(simdata.stats);
    oddsVsAdvantageDataNoDraw = formatData(simdata.stats, true);
  }
  $scope.oddsVsAdvantageData = oddsVsAdvantageData;
  $scope.oddsVsAdvantageDataNoDraw = oddsVsAdvantageDataNoDraw;

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
