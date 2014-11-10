// jshint node:true
'use strict';

var app = require('./meanrpgclient');
require('./controllers/MainCtrl');
require('./controllers/SkillCtrl');

app.config(function($routeProvider) {
  $routeProvider.when('/skills', {
    templateUrl: 'skills.html',
    controller: 'SkillCtrl'
  });
  $routeProvider.otherwise(function() {
    console.error('!!!');
  })
});
