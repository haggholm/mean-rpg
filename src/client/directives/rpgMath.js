/**
 * LaTeX/math rendering directive based on
 * http://lucasbardella.com/blog/2014/11/katex-angularjs
 */

'use strict';

var katex = require('katex')
  , ngModule = require('../RPG.Directives')
  , mathjax = require('mathjax');
//require('../../../git_modules/MathJax/config/TeX-AMS-MML_HTMLorMML');
require('../../../git_modules/MathJax/config/TeX-AMS_HTML');



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
      mathjax.Hub.Config({
        'HTML-CSS': {
          mtextFontInherit: true,
          webFont: 'STIX',
          availableFonts: []
        }//,
        //MMLorHTML: {
        //  preferredFont: 'STIX',
        //  availableFonts: []
        //}
        //MatchWebFonts: {
        //  matchFor: {
        //    'HTML-CSS': true,
        //    NativeMML: false,
        //    SVG: false
        //  },
        //  fontCheckDelay: 2000,
        //  fontCheckTimeout: 30 * 1000
        //}
      });

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
