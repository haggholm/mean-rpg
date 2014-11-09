// jshint node:true browser:true
'use strict';

var ng = require('angular'),
    meanrpg = require('../meanrpgclient');

meanrpg.app.controller('MainCtrl', function($scope) {
  $scope.title = 'Test';

  console.log('Foo');
});
