'use strict';

var ngModule = require('../RPG.Controllers')
  , tree = require('../../lib/calculation/tree');

module.exports = ngModule.controller('RulesCtrl',
  function($scope){
    $scope.cost = tree.valueToPoints;
  });
