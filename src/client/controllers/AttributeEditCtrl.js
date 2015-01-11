'use strict';

var _ = require('lodash')
  , ngModule = require('../RPG.Controllers')
  , tree = require('../../lib/calculation/tree')
  , TreeNode = tree.TreeNode;
require('../services/models');

module.exports = ngModule.controller('AttributeEditCtrl',
  function($scope, $stateParams, ModelService) {

    function updateAttributes(cb) {
      ModelService.Attribute.query(function(attrs) {
        $scope.attributeNodes = tree.makeTree(attrs);
        $scope.rootAttributeNodes = tree.roots($scope.attributeNodes);
        cb($scope.rootAttributeNodes);
      });
    }

    updateAttributes(function() {
      if ($stateParams.id) {
        $scope.activeAttributeNode = $scope.attributeNodes[$stateParams.id];
      } else {
        $scope.activeAttributeNode = new TreeNode(new ModelService.Attribute());
      }
    });

    $scope.saveAttribute = function() {
      var attribute = $scope.activeAttributeNode.object;
      if (attribute._id === undefined || attribute._id === null) {
        attribute.$save({}, function(attr){
          _.merge(attribute, attr);
          updateAttributes(function(attributeNodes){
            $scope.activeAttributeNode = attributeNodes[attr._id];
          });
        });
      } else {
        $scope.attribute.$update();
        updateAttributes(function(attributeNodes){
          $scope.activeAttributeNode = attributeNodes[attribute._id];
        });
      }
    };
  }
);
