'use strict';

var $ = require('jquery')
  , ngModule = require('../RPG.Directives');
require('bootstrap');


module.exports = ngModule.directive('bsmenu',
  function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: '/templates/bsmenu.html',
      link: function(scope/*, el, attrs*/) {
        var update = function() {
          scope.headings = [];
          $('h1,h2,h3').each(function(idx, el) {
            var id = el.id;
            if (id === undefined || id === null || id === '') {
              var txt = $(el).text().replace(/[^\w]+/g, '-')
                , i = 1;
              id = txt;
              while (document.getElementById(id)) {
                id = txt + '-' + (i++);
              }
              el.id = id;
            }
            scope.headings.push({
              id: el.id,
              tag: el.tagName.toLowerCase(),
              title: el.innerHTML
            });
          });
        };
        update();
        scope.$on('$stateChangeSuccess', update);
      }
    };
  });
