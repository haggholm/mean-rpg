'use strict';

var app = require('../app');

module.exports = app.service('ModelService', function($resource) {
  var models = {},
      baseURL = 'http://localhost:9001/api';

  models.Attribute = $resource(
    baseURL + '/attributes/:id',
    {id: '@_id'},
    { update: { method: 'PUT' } }
  );

  return models;
});
