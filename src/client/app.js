'use strict';

var page = require('page');
require('bootstrap');

// Directives module must be loaded; disable dev logging.
require('nv').dev = false;
require('angular-nvd3');


(function() {
  page({hashbang: true});

  page('/*', require('ui/index'));
  page('/attributes/edit', function(){});
  page('/attributes', function(){});
})();


module.exports = {
};

var app = ng.module('meanrpgclient', [
  'ui.router',
  'ngResource',
  'nvd3',
  'RPG.Controllers',
  'RPG.Directives',
  'RPG.Filters',
  'RPG.Services'
]);
module.exports = app;

app.config(function(
  $httpProvider, $locationProvider, $resourceProvider/*,
   $stateProvider*/) {
  $locationProvider.hashPrefix('!');

  $httpProvider.defaults.useXDomain = true;
  $resourceProvider.defaults.stripTrailingSlashes = false;

});

app.run(function($rootScope, $state) {
  var titleNode = document.getElementsByTagName('title')[0];
  $rootScope.$on(
    '$stateChangeSuccess',
    //function(event, toState, toParams, fromState, fromParams){
    function(event, toState) {
      console.debug('Transitioned to state: ' + toState.name);

      var s = $state.$current, titles = [];
      while (s) {
        if (s.data && s.data.title) {
          titles.push(
            s.data.title
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
          );
        }
        s = s.parent;
      }
      titleNode.innerHTML = 'RPG | ' + titles.reverse().join(' » ');
    });
});
