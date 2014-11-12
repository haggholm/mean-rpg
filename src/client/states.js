'use strict';

var app = require('./meanrpgclient');
require('./controllers/MainCtrl');
require('./controllers/AttributeCtrl');
require('./controllers/AttributeEditCtrl');

app.config(function($stateProvider) {
  $stateProvider.state('attribute', {
    url: '/attributes',
    templateUrl: 'attributes.html',
    controller: 'AttributeCtrl'
  });

  $stateProvider.state('attribute.edit', {
    url: '/{id}',
    templateUrl: 'attribute-edit.html',
    controller: 'AttributeEditCtrl'
  });

//  $locationProvider.otherwise(function() {
//    console.error('!!!');
//  })
});
