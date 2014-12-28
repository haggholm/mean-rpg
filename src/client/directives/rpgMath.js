/**
 * LaTeX/math rendering directive based on
 * http://lucasbardella.com/blog/2014/11/katex-angularjs
 */

'use strict';

var katex = require('katex')
  , ngModule = require('../RPG.Directives')
  , mathjax = require('mathjax');
require('mathjaxInit');

function render(text, element) {
  var domNode = element[0];
  try {
    katex.render(text, domNode);
  } catch (err) {
    // MathJax fallback
    if (text.substring(0, 15) === '\\displaystyle {') {
      text = text.substring(15, text.length - 1);
    }
    element.append(text);
    mathjax.Hub.Queue(['Typeset', mathjax.Hub, domNode]);
  }
}

module.exports = {
  rpgMath: ngModule.directive('rpgMath',
    function() {
      return {
        restrict: 'AE',
        link: function(scope, element) {
          var text = element.html();
          if (element[0].tagName === 'DIV') {
            //if (mathDefaults.center)
            element.addClass('text-center');
            text = '\\displaystyle {' + text + '}';
            element.addClass('katex-outer').html();
          }
          render(text, element);
        }
      };
    })
};
