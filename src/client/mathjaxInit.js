'use strict';

var mathjax = require('mathjax');
require('../../git_modules/MathJax/config/TeX-AMS_HTML');
//require('../../git_modules/MathJax/config/TeX-AMS-MML_HTMLorMML');

mathjax.Hub.Config({
  showProcessingMessages: false,
  messageStyle: 'none',
  skipStartupTypeset: true,
  'HTML-CSS': {
    mtextFontInherit: true,
    //matchFontHeight: true,
    webFont: 'STIX',
    availableFonts: [],
    EqnChunk: 2,
    EqnChunkFactor: 2,
    EqnChunkDelay: 50
  },
  //MMLorHTML: {
  //  preferredFont: 'STIX',
  //  availableFonts: []
  //},
  MatchWebFonts: {
    matchFor: {
      'HTML-CSS': true,
      NativeMML: false,
      SVG: false
    },
    fontCheckDelay: 500,
    fontCheckTimeout: 15 * 1000
  }
});
