'use strict';

var ngModule = require('../RPG.Directives')
  , Hypher = require('hypher')
  , english = require('hyphenation.en-us');


module.exports = ngModule.directive('hyphenate',
  function() {
    var hyphenator = new Hypher(english);
    return {
      restrict: 'AE',
      link: function(scope, el/*, attrs*/) {
        el.html(hyphenator.hyphenateText(el.html()));
        el.addClass('hyphenated');
      }
    };
  });
