'use strict';

var _ = require('lodash');

module.exports = {
  'es5-shim': require('es5-shim'),
  'lodash': _,
  'jquery': require('jquery'),
  'hypher': require('hypher'),
  'hyphenation.en-us': require('hyphenation.en-us'),
  'numeral': require('numeral')
};

window.jQuery = window.$ = require('jquery');
window.lodash = window._ = require('lodash');
