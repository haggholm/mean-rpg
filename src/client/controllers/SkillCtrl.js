// jshint node:true
'use strict';

var app = require('../meanrpgclient');

require('../services/models');

app.controller('SkillCtrl', function($scope, ModelService) {
  console.info('SkillCtrl');
  $scope.skills = ModelService.Skill.query();

  $scope.skill = new ModelService.Skill();
});
