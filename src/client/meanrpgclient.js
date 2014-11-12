'use strict';

var ng = require('angular');
require('angular-resource');
require('../../node_modules/angular-ui-router/release/angular-ui-router');

var app = ng.module('meanrpgclient', ['ui.router', 'ngResource']);

app.config(function($httpProvider, $locationProvider, $resourceProvider) {
//  $locationProvider.hashPrefix = '!';

  $httpProvider.defaults.useXDomain = true;
  $resourceProvider.defaults.stripTrailingSlashes = false;
});

module.exports = app;
