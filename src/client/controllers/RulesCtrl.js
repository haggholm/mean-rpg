'use strict';

var ngModule = require('../RPG.Controllers')
  , storage = require('../storage')
  , tree = require('../../lib/calculation/tree');

module.exports = ngModule.controller('RulesCtrl',
  function($scope){
    $scope.cost = tree.valueToPoints;

    $scope.advanced = storage.local.getItem('RulesCtrl.showAdvanced', false);
    $scope.$watch('advanced', function(advanced){
      storage.local.setItem('RulesCtrl.showAdvanced', advanced);
    });
  });
