// jshint node:true browser:true
'use strict';

var app = require('../meanrpgclient');

app.service('ModelService', function($resource) {
  var models = {},
      baseURL = 'http://localhost:9001/api';

  models.Skill = $resource(baseURL + '/skills/:id');

  return models;
});
