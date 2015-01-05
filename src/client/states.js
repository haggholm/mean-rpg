'use strict';

var app = require('./app');
require('./controllers/_all');
require('./directives/roll');

app.config(function($stateProvider) {
  $stateProvider.state('roll-stats', {
    url: '/roll-stats',
    templateUrl: '/templates/roll-breakdown.html',
    controller: 'RollBreakdownCtrl',
    data: { title: 'Roll statistics' }
  });

  $stateProvider.state('attribute', {
    url: '/attributes',
    templateUrl: '/templates/attributes.html',
    controller: 'AttributeCtrl',
    data: { title: 'Attributes' }
  });

  $stateProvider.state('attribute.edit', {
    url: '/{id}',
    templateUrl: '/templates/attribute-edit.html',
    controller: 'AttributeEditCtrl'
  });

  $stateProvider.state('attribute-values', {
    url: '/attribute-values',
//    abstract: true,
    template: '<div ui-view></div>'
  })
    .state('attribute-values.edit', {
      url: '/',
      templateUrl: '/templates/attribute-values.html',
      controller: 'AttributeValueCtrl'//require('./controllers/AttributeValueCtrl')
    });

  $stateProvider.state('rules', {
    url: '/rules',
    abstract: true,
    templateUrl: '/templates/rules/rules.html',
    data: { title: 'Rules' },
    controller: 'RulesCtrl'
  })
    .state('rules.combat', {
      url: '/combat',
      templateUrl: '/templates/rules/combat.html',
      data: {
        title: 'Combat'
      }
    })
    .state('rules.creation', {
      url: '/creation',
      templateUrl: '/templates/rules/creation.html',
      data: {
        title: 'Character creation'
      }
    })
    .state('rules.skills', {
      url: '/skills',
      templateUrl: '/templates/rules/skills.html',
      data: {
        title: 'Skills'
      }
    });


//  $locationProvider.otherwise(function() {
//    console.error('!!!');
//  })
});
