'use strict';

var ngModule = require('../RPG.Services');

module.exports = ngModule.service('ModelService',
  function($resource) {
    var models = {}
      , baseURL = 'http://localhost:9001/api';

    models.Attribute = $resource(
      baseURL + '/attributes/:id',
      {id: '@_id'},
      {update: {method: 'PUT'}}
    );

    return models;
  });
