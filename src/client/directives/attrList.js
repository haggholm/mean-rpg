'use strict';

var ngModule = require('../RPG.Directives');
require('../services/RecursionService');

ngModule.directive('attrList', function(RecursionHelper) {
  return {
    scope: {
      attributeNode: '=',
      activeAttributeNode: '='
    },
    template: '<div class="rpg-attr-list"> ' +
              '<a class="list-group-item" ' +
              '   ng-class="{active: activeAttributeNode === attributeNode}" ' +
              '   ui-sref="attribute.edit({id: attributeNode.object._id})" ' +
              '   ng-bind="attributeNode.object.name"></a> ' +

              '<div class="list-group" ng-if="attribute.children.length"> ' +
              '  <attr-list ng-repeat="ch in attributeNode.children|orderBy:\'name\'" ' +
              '             attribute-node="ch"' +
              '             active-attribute-node="activeAttributeNode"></attr-list>' +
              '</div>' +
              '</div>',
    compile: function(element) {
      return RecursionHelper.compile(element);
    }
  };
});
