'use strict';

var ng = require('angular');
// Load Angular modules needed for app initialization
require('angular-resource');
require('angular-ui-router');
// Directives module must be loaded; disable dev logging.
require('nvd3').dev = false;
require('angular-nvd3');
require('bootstrap');

require('./directives/bsmenu');
require('./directives/roll');

require('./RPG.Controllers');
require('./RPG.Directives');
require('./RPG.Services');

var app = ng.module('meanrpgclient', [
  'ui.router',
  'ngResource',
  'meanrpg.directives',
  'nvd3',
  'RPG.Controllers',
  'RPG.Directives',
  'RPG.Services'
]);

app.config(function($httpProvider, $locationProvider, $resourceProvider/*,
                    $stateProvider*/) {
  $locationProvider.hashPrefix('!');

  $httpProvider.defaults.useXDomain = true;
  $resourceProvider.defaults.stripTrailingSlashes = false;

});

app.run(function($rootScope) {
  $rootScope.$on(
    '$stateChangeSuccess',
    //function(event, toState, toParams, fromState, fromParams){
    function(event, toState) {
        console.debug('Transitioned to state: '+toState.name);
  });
});

module.exports = app;
