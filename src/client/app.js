'use strict';

var ng = require('angular');
// Load Angular modules needed for app initialization
require('angular-resource');
require('angular-ui-router');
// Directives module must be loaded; disable dev logging.
require('nvd3').dev = false;
require('angularjs-nvd3-directives');
require('angular-nvd3');

require('./directives/bsmenu');
require('./directives/roll');

var app = ng.module('meanrpgclient', [
  'ui.router',
  'ngResource',
  'nvd3ChartDirectives',
  'meanrpg.directives',
  'nvd3'
]);

app.config(function($httpProvider, $locationProvider, $resourceProvider,
                    $stateProvider) {
//  $locationProvider.hashPrefix = '!';

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
