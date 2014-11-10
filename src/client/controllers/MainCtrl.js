// jshint node:true browser:true
'use strict';

var app = require('../meanrpgclient');

app.controller('MainCtrl', function($scope) {
  $scope.title = 'Test';

  console.log('Foo');
});
