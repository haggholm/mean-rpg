'use strict';

var _ = require('lodash')
  , app = require('../meanrpgclient')
  , tree = require('../../lib/calculation/tree')
  , d3 = require('d3')
  , simdata = require('../rolls.json');

require('../services/models');


module.exports = app.controller('AttributeValueCtrl', function($scope, ModelService) {
  console.log('?');
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

    $scope.$watch(
      function() { return _.pluck($scope.attributes, 'points'); },
      function(){
        tree.recalculateValues($scope.attributes);
        _.each($scope.attributes, function(attr) {
          attr.vs = _.map(levels, function(l, idx) {
            var v = attr.value - idx;
            return {
              description: l,
              chance: v < 0 ? simdata.stats[-v].losses : simdata.stats[v].wins
            };
          });
        });
        console.log($scope.attributes);
      },
      true
    );
  });
});
