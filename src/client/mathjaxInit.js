'use strict';

var _ = require('lodash')
  , browser = require('jquery-browser-plugin');

var useMathJax = !browser.mozilla;

var typeset;
if (!useMathJax) {
  console.info('Not loading MathJax: Firefox implements MathML!');
  typeset = function() {
    // nop
  };
  var css = {

  };
  var cssTag = document.createElement('style');
  cssTag.type = 'text/css';
  _.forOwn(css, function(rule, selector) {
    cssTag.innerHTML += selector + '{\n';
    _.forOwn(rule, function(val, prop) {
      cssTag.innerHTML += (
        prop + ':' +
        (typeof(val) === 'number' ? val : '"' + val + '"') + ';\n');
    });
    cssTag.innerHTML += '}\n';
  });
  document.getElementsByTagName('head')[0].appendChild(cssTag);

} else {
  console.warn('Loading MathJax to compensate for lack of browser support for' +
               'MathML');
  var config = {
    config: ['TeX-AMS-MML_HTMLorMML-full.js'],
    jax: ['input/MathML', 'input/TeX', 'output/HTML-CSS', 'output/NativeMML'],
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

  var queued = [];
  typeset = function(domNode) {
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

  mathJaxScript.src = '//cdn.mathjax.org/mathjax/2.4-latest/MathJax.js';
  head.appendChild(mathJaxScript);
}

module.exports = {
  typeset: function(domNode) {
    typeset(domNode);
  },
  useMathJax: useMathJax
};
