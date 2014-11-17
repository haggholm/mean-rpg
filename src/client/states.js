'use strict';

var app = require('./meanrpgclient');
require('./controllers/_all');

app.config(function($stateProvider) {
  $stateProvider.state('attribute', {
    url: '/attributes',
    templateUrl: 'attributes.html',
    controller: 'AttributeCtrl'//require('./controllers/AttributeCtrl')
  });

  $stateProvider.state('attribute.edit', {
    url: '/{id}',
    templateUrl: 'attribute-edit.html',
    controller: 'AttributeEditCtrl'//require('./controllers/AttributeEditCtrl')
  });

  $stateProvider.state('attribute-values', {
    url: '/attribute-values',
//    abstract: true,
    template: '<div ui-view></div>'
  })
  .state('attribute-values.edit', {
    url: '/',
    templateUrl: 'attribute-values.html',
    controller: 'AttributeValueCtrl'//require('./controllers/AttributeValueCtrl')
  });


//  $locationProvider.otherwise(function() {
//    console.error('!!!');
//  })
});
