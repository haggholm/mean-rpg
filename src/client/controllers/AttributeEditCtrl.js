'use strict';

var app = require('../meanrpgclient');
require('../services/models');

app.controller('AttributeEditCtrl',
  function($scope, $stateParams, ModelService) {
    if ($stateParams.id) {
      $scope.attribute = ModelService.Attribute.get({id: $stateParams.id});
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
