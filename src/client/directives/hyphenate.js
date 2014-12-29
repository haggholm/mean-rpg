'use strict';

var ngModule = require('../RPG.Directives');

module.exports = ngModule.directive('hyphenate',
  function() {
    var prefixes = [
      'ex',
      'in',
      'pre',
      'post',
      '\\w+[aeiouy]rse',
      '\\w+ey',
      'pre',
      '\\w*pro',
      'post',
      'sub',
      'super',
      'un'
    ];
    var suffixes = [
      '\\w+[aeiou][ae]te',
      'al',
      'ance',
      'cal',
      'ed',
      'er',
      'ence',
      'graphy',
      'hood',
      'ing',
      'ledge',
      'ling',
      'ly',
      'man',
      'one',
      'other',
      'phy',
      'posed',
      'ness',
      'san',
      'ship',
      'sion(?:al(?:ly)?)?',
      'tion(?:al(?:ly)?)?',
      'tude',
      'tive',
      'woman'
    ];
    var prefixRegex = new RegExp(
      '(\\b|[^\\w])(' + prefixes.join('|') +  ')(\\w{2,})',
      'ig'
    );
    var suffixRegex = new RegExp(
      '(\\w{2,})(' + suffixes.join('|') + ')(\\b|[^\\w])',
      'ig'
    );

    return {
      restrict: 'AE',
      link: function(scope, el, attrs) {
        el.html(el.html()
          .replace(prefixRegex, '$1$2&shy;$3')
          .replace(suffixRegex, '$1&shy;$2$3')
        );
      }
    };
  });
