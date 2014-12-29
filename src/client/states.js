'use strict';

var app = require('./app');
require('./controllers/_all');
require('./directives/roll');

app.config(function($stateProvider) {
  $stateProvider.state('roll-stats', {
    url: '/roll-stats',
    templateUrl: 'roll-breakdown.html',
    controller: 'RollBreakdownCtrl',
    data: { title: 'Roll statistics' }
  });

  $stateProvider.state('attribute', {
    url: '/attributes',
    templateUrl: 'attributes.html',
    controller: 'AttributeCtrl',
    data: { title: 'Attributes' }
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
    templateUrl: 'rules/rules.html',
    data: { title: 'Rules' },
    controller: 'RulesCtrl'
  })
    .state('rules.combat', {
      url: '/combat',
      templateUrl: 'rules/combat.html',
      data: {
        title: 'Combat'
      }
    })
    .state('rules.creation', {
      url: '/creation',
      templateUrl: 'rules/creation.html',
      data: {
        title: 'Character creation'
      }
    })
    .state('rules.skills', {
      url: '/skills',
      templateUrl: 'rules/skills.html',
      data: {
        title: 'Skills'
      }
    });


//  $locationProvider.otherwise(function() {
//    console.error('!!!');
//  })
});
