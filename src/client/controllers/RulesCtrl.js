'use strict';

var ngModule = require('../RPG.Controllers')
  , storage = require('../storage')
  , tree = require('../../lib/calculation/tree');

module.exports = ngModule.controller('RulesCtrl',
  function($scope){
    $scope.cost = tree.valueToPoints;

    $scope.show = {};
    $scope.show.advanced = storage.local.getItem('RulesCtrl.showAdvanced', false);
    $scope.$watch('show.advanced', function(advanced){
      storage.local.setItem('RulesCtrl.showAdvanced', advanced);
    });

    $scope.show.examples = storage.local.getItem('RulesCtrl.showExamples', true);
    $scope.$watch('show.examples', function(examples){
      storage.local.setItem('RulesCtrl.showExamples', examples);
    });

    $scope.show.statistics = storage.local.getItem('RulesCtrl.showStatistics', true);
    $scope.$watch('show.statistics', function(statistics){
      storage.local.setItem('RulesCtrl.showStatistics', statistics);
    });
  });
