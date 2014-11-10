// jshint node:true

var ng = require('angular');
require('angular-resource');
require('angular-route');

var app = ng.module('meanrpgclient', ['ngRoute', 'ngResource']);

app.config(function($locationProvider, $resourceProvider) {
//  $locationProvider.hashPrefix = '!';
  $resourceProvider.defaults.stripTrailingSlashes = false;
});

module.exports = app;
