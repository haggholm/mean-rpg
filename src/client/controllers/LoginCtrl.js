'use strict';

var app = require('../app');
require('../services/SessionService');

module.exports = app.controller('LoginCtrl',
  function($scope, SessionService) {
    $scope.loginData = {};
    $scope.login = function() {
      SessionService.login(loginData.username, loginData.password);
    };
  });
