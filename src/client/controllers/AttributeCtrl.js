'use strict';

var _ = require('lodash')
  , ngModule = require('../RPG.Controllers');
require('../services/models');

ngModule.controller('AttributeCtrl',
  function($scope, ModelService) {
    $scope.attrById = {};
    $scope.attributes = ModelService.Attribute.query(function() {
      _.each($scope.attributes, function(a) {
        $scope.attrById[a._id] = a;
        a.children = [];
      });
      _.each($scope.attributes, function(a) {
        if (a.parent !== undefined) {
          a.parent = $scope.attrById[a.parent];
          a.parent.children.push(a);
        }
      });
    });
  });
