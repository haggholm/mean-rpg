'use strict';

var $ = require('jquery')
  , _ = require('lodash')
  , ngModule = require('../RPG.Controllers')
  , d3 = require('d3-browserify')
  , simdata = require('../../data/rolls.processed.json')
  , util = require('../util');

var WIN_KEY = '% wins'
  , DRAW_KEY = '% draws'
  , LOSS_KEY = '% lost';

function formatAdvantage(adv) {
  if (isNaN(adv)) {
    return adv;
  }
  adv = Number(adv);
  if (adv < 0) {
    return adv.toString().replace('-', '−');
  } else if (adv === 0) {
    return '±0';
  } else {
    return '+' + adv.toString();
  }
}


module.exports = ngModule.controller('RollBreakdownCtrl',
  function($scope, $timeout) {
    $scope.meanRoll = simdata.meanRoll;
    $scope.oddsVsAdvantageData = simdata.oddsVsAdvantageData;
    $scope.oddsVsAdvantageDataNoDraw = simdata.oddsVsAdvantageDataNoDraw;

    var colourMap = {};
    var saturation = 2 / 3, lightness = 0.5, minHue = 2, maxHue = 110;
    var mGetColour = _.memoize(function(pct) {
      var hue = minHue + (maxHue - minHue) * (pct / 100);
      return d3.hsl(hue, saturation, lightness);
    });
    colourMap[WIN_KEY] = mGetColour(100);
    colourMap[DRAW_KEY] = mGetColour(50);
    colourMap[LOSS_KEY] = mGetColour(0);

    var formatPercentage = util.getPercentFormatter(2);

    var descMap = {};
    descMap[WIN_KEY] = 'winning';
    descMap[DRAW_KEY] = 'drawing';
    descMap[LOSS_KEY] = 'losing';

    $scope.nvd3config = {
      refreshDataOnly: false,
      autorefresh: true
    };

    var advantageToNumber = _.memoize(function(x) {
      switch (x[0]) {
        case '+':
        case '-':
          return Number(x);
        case '−':
        case '–':
          return -Number(x.substr(1));
        case '±':
          return 0;
        default:
          throw 'Unexpected “advantage”: ' + x;
      }
    });

    var container = $('#main-container')
      , containerMargin = 20
      , chartWidth = container.innerWidth() - containerMargin;
    var chartOptions = {
      type: 'multiBarChart',
      showControls: false,
      height: 400,
      width: chartWidth,
      margin: {top: 0, right: 0, bottom: 50, left: 150},
      tooltips: true,
      tooltipContent: function(key, x, y/*, e, graph*/) {
        var advantage = advantageToNumber(x);
        return (
        '<div class="tooltip-inner" ' +
        'style="display:inline-block;max-width:100%;">' +
        '<p>With a <strong>' + x + '</strong>' +
        (advantage < 0 ? ' disadvantage, ' : ' advantage, ') +
        'there is a <strong>' + y + '</strong> chance of ' + descMap[key] +
        '</p></div>'
        );
      },

      valueFormat: formatPercentage,
      reduceXTicks: false,
      transitionDuration: 0,
      showLegend: true,
      showValues: true,
      x: function(v) {
        return v[0];
      },
      y: function(v) {
        return v[1];
      },
      showXAxis: true,
      showYAxis: true,
      stacked: true,
      staggerLabels: true,
      xAxis: {
        axisLabel: 'Advantage',
        tickFormat: formatAdvantage
      },
      yAxis: {
        axisLabel: 'Win / draw / lose',
        tickFormat: formatPercentage,
        tickValues: _.range(0, 100, 10)
      }
    };
    var legendOptions = {
      color: [
        colourMap[WIN_KEY],
        colourMap[DRAW_KEY],
        colourMap[LOSS_KEY]
      ]
    };
    $scope.nvd3optionsWithAdvantage = {
      chart: _.extend({}, chartOptions, {id: 'odds-vs-advantage'}),
      legend: legendOptions
    };
    $scope.nvd3optionsNoDraw = {
      chart: _.extend({}, chartOptions, {id: 'odds-vs-advantage-no-draw'}),
      legend: legendOptions
    };

    _.forEach([$scope.oddsVsAdvantageData, $scope.oddsVsAdvantageDataNoDraw],
      function(data) {
        _.forEach(data, function(d) {
          d.color = colourMap[d.key];
        });
      });

    var resizeTimeout = null;
    $scope.$watch(
      function() {
        return container.innerWidth();
      },
      function(w) {
        if (resizeTimeout !== null) {
          $timeout.cancel(resizeTimeout);
          resizeTimeout = null;
        }
        resizeTimeout = $timeout(function() {
          w -= containerMargin;
          if (w !== $scope.nvd3optionsWithAdvantage.chart.width) {
            $scope.nvd3optionsWithAdvantage.chart.width = w;
            $scope.nvd3optionsNoDraw.chart.width = w;
          }
          resizeTimeout = null;
        }, 100);
      }
    );

    var w = $(window), resizeListener = function() {
      $scope.$apply();
    };
    w.on('resize', resizeListener);
    $scope.$on('$destroy', function() {
      console.log('deregister');
      w.off('resize', resizeListener);
    });
  });
