'use strict';

var _ = require('lodash')
  , app = require('../meanrpgclient')
  , tree = require('../../lib/calculation/tree');
require('../services/models');


module.exports = app.controller('AttributeValueCtrl', function($scope, ModelService) {
  console.log('?');
  ModelService.Attribute.query(function(attrs) {
    attrs.forEach(function(a) {
      a.points = 0;
    });
    $scope.attributes = attrs;
    $scope.$watch(
      function() { return _.pluck($scope.attributes, 'points'); },
      function(){
        console.log('Recalculate ', _.pluck($scope.attributes, 'points'));
        tree.recalculateValues($scope.attributes);
        console.log($scope.attributes);
      },
      true
    );
  });
});
