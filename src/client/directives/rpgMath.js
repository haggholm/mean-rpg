/**
 * LaTeX/math rendering directive based on
 * http://lucasbardella.com/blog/2014/11/katex-angularjs
 */

'use strict';

var $ = require('jquery')
  , ngModule = require('../RPG.Directives')
  , mathjax = require('mathjaxInit');


module.exports = {
  rpgMath: ngModule.directive('math',
    function() {
      return {
        restrict: 'E',
        link: function(scope, element) {
          var preview = $(element[0]).closest('.MathJax_Preview');
          mathjax.typeset(preview.next('script')[0],
            function(){
              preview.hide();
            });
        }
      };
    })
};
