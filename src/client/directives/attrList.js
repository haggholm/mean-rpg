'use strict';

var ngModule = require('../RPG.Directives');
require('../services/RecursionService');

ngModule.directive('attrList', function(RecursionHelper) {
  return {
    scope: {
      attribute: '=',
      activeAttribute: '='
    },
    template: '<div class="rpg-attr-list"> ' +
              '<a class="list-group-item" ' +
              '   ng-class="{active: activeAttribute === attribute}" ' +
              '   ui-sref="attribute.edit({id: attribute._id})" ' +
              '   ng-bind="attribute.name"></a> ' +

              '<div class="list-group" ng-if="attribute.children.length"> ' +
              '  <attr-list ng-repeat="ch in attribute.children|orderBy:\'name\'" ' +
              '             attribute="ch"' +
              '             active-attribute="activeAttribute"></attr-list>' +
              '</div>' +
              '</div>',
    compile: function(element) {
      return RecursionHelper.compile(element);
    }
  };
});
