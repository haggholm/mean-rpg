'use strict';

var ng = require('angular');
require('angular-resource');
require('../../node_modules/angular-ui-router/release/angular-ui-router');
require('d3');
require('nvd3');
require('angularjs-nvd3-directives');

require('./directives/bsmenu');
require('./directives/roll');

var app = ng.module('meanrpgclient', [
  'ui.router',
  'ngResource',
  'nvd3ChartDirectives',
  'meanrpg.directives'
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
