'use strict';

var _ = require('lodash');


var config = {
  config: ['TeX-AMS-MML_HTMLorMML-full.js'],
  jax: ['input/TeX', 'output/HTML-CSS', 'output/NativeMML'],
  extensions: ['tex2jax.js', 'MathMenu.js', 'MathZoom.js'],
  TeX: {
    extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
  },
  showProcessingMessages: false,
  messageStyle: 'none',

  skipStartupTypeset: true,

  'HTML-CSS': {
    mtextFontInherit: true,
    matchFontHeight: true,
    webFont: 'STIX-Web', // STIX
    availableFonts: []/*,
     EqnChunk: 2,
     EqnChunkFactor: 2,
     EqnChunkDelay: 50*/
  },
  NativeMML: {
    matchFontHeight: true
  },
  MMLorHTML: {
    prefer: {
      Firefox: 'MML'
    }
  },
  MatchWebFonts: {
    matchFor: {
      'HTML-CSS': true,
      NativeMML: false/*,
       SVG: false*/
    },
    fontCheckDelay: 500,
    fontCheckTimeout: 15 * 1000
  }
};

var head = document.getElementsByTagName('head')[0];

var configScript = document.createElement('script');
configScript.type = 'text/x-mathjax-config';
configScript.innerHTML = 'MathJax.Hub.Config(' + JSON.stringify(config) + ');';
head.appendChild(configScript);

var queued = [], typeset = function(domNode) {
  queued.push(domNode);
};
var mathJaxScript = document.createElement('script');
mathJaxScript.type = 'text/javascript';
mathJaxScript.defer = true;
mathJaxScript.onload = function() {
  typeset = function(domNode) {
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, domNode]);
  };
  _.forEach(queued, function(v) {
    typeset(v);
  });
  console.log('Processed ' + queued.length + ' queued MathJax nodes');
  while (queued.length) {
    queued.pop();
  }
};

var local = false
, base = local ? 'MathJax/' : '//cdn.mathjax.org/mathjax/2.4-latest/';
mathJaxScript.src = (true ?
  base + 'MathJax.js' :
  base + 'MathJax.js?config=TeX-AMS-MML_HTMLorMML-full');
head.appendChild(mathJaxScript);

module.exports = {
  typeset: function(domNode) {
    typeset(domNode);
  }
};
