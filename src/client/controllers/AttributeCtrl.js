'use strict';

var _ = require('lodash')
  , app = require('../app');
require('../services/models');

app.controller('AttributeCtrl', function($scope, ModelService) {
  $scope.attrById = {};
  $scope.attributes = ModelService.Attribute.query(function() {
    _.each($scope.attributes, function(a) {
      $scope.attrById[a._id] = a;
      a.children = [];
    });
    _.each($scope.attributes, function(a) {

      a.parent = $scope.attrById[a.parent];
      a.parent.children.push(a);
    });
  });
});
