'use strict';

var app = require('../meanrpgclient');
require('../services/models');

app.controller('AttributeCtrl', function($scope, ModelService) {
  $scope.attributes = ModelService.Attribute.query();
});
