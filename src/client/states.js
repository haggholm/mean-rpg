'use strict';

var app = require('./app');
require('./controllers/_all');
require('./directives/roll');

app.config(function($stateProvider) {
  $stateProvider.state('roll-stats', {
    url: '/roll-stats',
    templateUrl: 'roll-breakdown.html',
    controller: 'RollBreakdownCtrl'
  });

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

  $stateProvider.state('rules', {
    url: '/rules',
    abstract: true,
    template: '<div ui-view></div>'
  })
    .state('rules.combat', {
      url: '/combat',
      templateUrl: 'rules/combat.html'
    })
    .state('rules.creation', {
      url: '/creation',
      templateUrl: 'rules/creation.html'
    })
    .state('rules.skills', {
      url: '/skills',
      templateUrl: 'rules/skills.html'
    });


//  $locationProvider.otherwise(function() {
//    console.error('!!!');
//  })
});
