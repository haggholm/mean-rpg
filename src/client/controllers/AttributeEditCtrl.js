'use strict';

var ngModule = require('../RPG.Controllers');
require('../services/models');

ngModule.controller('AttributeEditCtrl',
  function($scope, $stateParams, ModelService) {
    if ($stateParams.id) {
      $scope.attribute = ModelService.Attribute.get({id: $stateParams.id},
      function(){
        var a = $scope.attribute;
        if ($scope.attrById.hasOwnProperty(a._id)) {
          a.children = $scope.attrById[a._id].children;
        }
      });
    } else {
      $scope.attribute = new ModelService.Attribute();
    }

    $scope.saveAttribute = function() {
      if ($scope.attribute._id === undefined ||
          $scope.attribute._id === null) {
        $scope.attribute.$save({}, function(attr){
          $scope.attribute = attr;
          $scope.attributes.push(attr);
        });
      } else {
        $scope.attribute.$update();
      }
    };
  }
);
