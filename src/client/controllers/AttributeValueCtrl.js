'use strict';

var _ = require('lodash')
  , ngModule = require('../RPG.Controllers')
  , tree = require('../../lib/calculation/tree')
  , simdata = require('../../data/rolls.processed.json')
  , util = require('../util')
  , d3 = require('d3');
require('../services/models');


var i, data_ = simdata.oddsVsAdvantageDataNoDraw, data;
for (i = 0; i < data_.length; i++) {
  if (data_[i].key === '% wins') {
    data = data_[i].values;
    break;
  }
}

module.exports = ngModule.controller('AttributeValueCtrl',
  function($scope, $timeout, ModelService) {
    $scope._ = _;

    var getRoot = _.memoize(function (node) {
      while (node.parent !== undefined && node.parent !== null) {
        node = node.parent;
      }
      return node;
    }, function(node) { return node._id; });

    var getAllChildren = _.memoize(function(node) {
      var i, ch, children = [];
      if (node.children) {
        for (i = node.children.length-1; i >= 0; i--) {
          ch = node.children[i];
          children = children.concat([ch], getAllChildren(ch));
        }
      }
      return children;
    }, function(node) { return node._id; });

    var simDataKeys = _.map(data, function(v) {
        return v[0];
      })
      , simDataMin = _.min(simDataKeys)
      , simDataMax = _.max(simDataKeys)
      , assocData = {};
    for (var i = 0; i < data.length; i++) {
      assocData[data[i][0]] = data[i][1];
    }
    var getValue = _.memoize(function(v) {
      return v < 0 ?
        assocData[Math.max(simDataMin, v)] :
        assocData[Math.min(simDataMax, v)];
    });

    var saturation = 2 / 3, lightness = 0.5, minHue = 2, maxHue = 110;
    var mGetColour = _.memoize(function(pct) {
      var hue = minHue + (maxHue - minHue) * (pct / 100);
      return d3.hsl(hue, saturation, lightness);
    });
    var levels = {
      0: 'Neophyte',
      4: 'Novice',
      8: 'Apprentice',
      12: 'Journeyman',
      16: 'Master',
      20: 'Grandmaster'
    };

    ModelService.Attribute.query(function(attrs) {
      attrs.forEach(function(a) {
        a.points = 0;
      });
      $scope.attributes = attrs;

      tree.treeify(attrs);

      var getFullName = /*_.memoize(*/function(node) {
        var n = node, names = [node.name];
        while (n.parent) {
          names.push(n.parent.name);
          n = n.parent;
        }
        names.reverse();
        node.depth = names.length - 1;
        node.fullName = names.join(' ');
        return names.join(' ');
      }/*, function(n) { return n._id; })*/;

      attrs.sort(function(a, b) {
        var aName = getFullName(a)
          , bName = getFullName(b);
        return aName < bName ? -1 : +1;
      });

      $scope.nvd3config = {
        refreshDataOnly: true,
        autorefresh: true
      };
      var percentFormat = util.getPercentFormatter(2);
      var chartOptions = {
        type: 'multiBarHorizontalChart',
        showControls: false,
        height: 50,
        width: 100,
        margin: {top: 0, right: 0, bottom: 0, left: 0},
        tooltips: true,
        tooltipContent: function(key, x, y/*, e, graph*/) {
          var opponentLevel = levels[Number(x).toFixed(0)];
          return (
          '<div class="tooltip-inner" ' +
          'style="display:inline-block;max-width:100%;">' +
          '<p>Vs. ' +
          opponentLevel +
          ': ' +
          percentFormat(Number(y)) +
          ' chance of winning' +
          '</p></div>'
          );
        },
        barColor: function(v) {
          return mGetColour(v.pct);
        },

        valueFormat: percentFormat,
        transitionDuration: 0,
        xDomain: [0, 4, 8, 12, 16],
        yDomain: [0, 100],
        showLegend: false,
        showValues: false,
        x: function(v) {
          return v.vs;
        },
        y: function(v) {
          return v.pct;
        },
        showXAxis: false,
        showYAxis: false,
        stacked: false
      };

      var idGen = 0;
      var recalculate = function() {
        var changedNodes = [];
        _.forEach($scope.attributes, function(attr) {
          if (attr.points === attr._oldPoints) {
            // No need to recalculate if points didn't change.
            return;
          }
          attr._oldPoints = attr.points;

          var root = getRoot(attr);
          if (changedNodes.indexOf(root) === -1) {
            changedNodes = changedNodes
              .concat([root], getAllChildren(root));
          }
        });

        tree.recalculateValues(changedNodes);

        _.forEach($scope.attributes, function(attr) {
          if (attr.value === attr._oldValue) {
            // No need to redraw the chart if the value didn't change.
            return;
          }
          attr._oldValue = attr.value;

          if (attr.value < 0) {
            attr.level = levels[0];
          } else {
            for (i = attr.value; i >= 0; i--) {
              if (levels.hasOwnProperty(i)) {
                attr.level = levels[i];
                break;
              }
            }
          }

          // @TODO: Add GM stats
          var l2 = _.clone(levels);
          delete l2[20];
          var nvd3values = _.map(l2, function(l, idx) {
            var opponentLevel = Number(idx)
              , advantage = attr.value - opponentLevel
              , pct = getValue(advantage);
            return {vs: opponentLevel, pct: pct};
          });

          if (attr.nvd3data === undefined) {
            attr.nvd3data = [{key: '…', values: nvd3values}];
            attr.nvd3options = {
              chart: _.extend({id: 'nvd3-' + (++idGen)}, chartOptions)
            };
          } else {
            var aValues = attr.nvd3data[0].values;
            for (i = nvd3values.length - 1; i >= 0; i--) {
              if (aValues[i] !== nvd3values[i]) {
                aValues[i] = nvd3values[i];
              }
            }
          }
        });
      };

      $scope.$watch(
        function() {
          return _.pluck($scope.attributes, 'points');
        },
        recalculate,
        true
      );
    });
  });
