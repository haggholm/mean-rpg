'use strict';

var ngModule = require('../RPG.Controllers')
  , tree = require('../../lib/calculation/tree');
require('../services/models');

ngModule.controller('AttributeCtrl',
  function($scope, ModelService) {
    $scope.updateAttributes = function(cb) {
      ModelService.Attribute.query(function(attrs) {
        $scope.attributeNodes = tree.makeTree(attrs);
        $scope.rootAttributeNodes = tree.roots($scope.attributeNodes);
        if (cb) {
          cb($scope.attributeNodes);
        }
      });
    };
    $scope.updateAttributes();
  });
