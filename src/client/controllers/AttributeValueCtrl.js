'use strict';

var _ = require('lodash')
  , app = require('../app')
  , tree = require('../../lib/calculation/tree')
  , simdata = require('../../data/rolls.json')
  , util = require('../util');
var d3 = require('d3-browserify');

require('../services/models');


module.exports = app.controller('AttributeValueCtrl', function($scope, ModelService) {
  ModelService.Attribute.query(function(attrs) {
    attrs.forEach(function(a) {
      a.points = 0;
    });
    $scope.attributes = attrs;

    var levels = {
      0: 'Neophyte',
      4: 'Novice',
      8: 'Apprentice',
      12: 'Journeyman',
      16: 'Master'
    };

    var simDataKeys = _.map(_.keys(simdata.stats), Number)
      , simDataMax = _.max(simDataKeys);
    var getValue = _.memoize(function(v){
      return Number(v < 0) ?
        simdata.stats[Math.min(simDataMax, -v)].losses :
        simdata.stats[Math.min(simDataMax, v)].wins;
    });

    var recalculate = function(){
      tree.recalculateValues($scope.attributes);
      _.each($scope.attributes, function(attr) {
        //attr.d3data = [{
        //  key: 'Versus level',
        //  values: _.map(levels, function(l, idx) {
        //    idx = Number(idx);
        //    var v = attr.value - idx;
        //    return [idx, Number(v < 0) ?
        //        simdata.stats[-v].losses :
        //        simdata.stats[v].wins];
        //  })
        //}];
        var d3data = _.map(levels, function(l, idx) {
          var opponentLevel = Number(idx)
            , v = attr.value - opponentLevel;
          return {
            key: levels[opponentLevel],
            values: [[opponentLevel, getValue(v)]]
          };
        });
        if (!_.isEqual(d3data, attr.d3data)) {
          attr.d3data = d3data;
        }
      });
    };

    $scope.formatPercentage = util.getPercentFormatter(2);

    $scope.margin = { top: 50, bottom: 50, left: 50, right: 50 };
    $scope.mkTooltip = function(key, x, y/*, e, graph*/) {
      // key === type
      // y === percentage
      //var advantage = Number(x.replace('−', '-').replace('±', ''));
      var opponentLevel = levels[Number(x).toFixed(0)];
      return(
        '<div class="tooltip-inner" ' +
        'style="display:inline-block;max-width:100%;">' +
        '<p>Vs. '+opponentLevel+': '+y+' chance of winning'+
        '</p></div>'
      );
    };
    $scope.$watch(
      function() { return _.pluck($scope.attributes, 'points'); },
      recalculate,
      true
    );
    recalculate();

    var saturation = 2/3, lightness = 0.5;
    var minHue = 2, maxHue = 110;
    var getColour = _.memoize(function(v) {
      var hue = minHue + (maxHue-minHue)*(v/100);
      return d3.hsl(hue, saturation, lightness);
    });
    $scope.getColour = function(v) {
      return getColour(v.values[0][1].toFixed(0));
    };
  });
});
