'use strict';

var chalk = require('chalk')
  , through2 = require('through2')
  , jsdom = require('jsdom').jsdom
  , mjAPI = require('MathJax-node/lib/mj-page')
  , PluginError = require('gulp-util').PluginError;

var PLUGIN_NAME = 'gulp-mathjaxify';

mjAPI.config({
  MathJax: {
    menuSettings: {
      semantics: true,
      texHints: false
    }
  }
});
mjAPI.start();
var n = 0;

/**
 * Process an HTML file:
 */
function processHTML(html, callback) {
  var isFragment = !/(\s*<!DOCTYPE html>)\s*<html/im.test(html);
  var document, xmlns;
  try {
    document = jsdom(html, null, {features: {FetchExternalResources: false}});
  } catch (e) {
    console.log(chalk.red('Failed to construct jsdom'));
    throw e;
  }
  try {
    xmlns = getXMLNS(document);
  } catch (e) {
    console.log(chalk.red('Failed to infer xmlns'));
    throw e;
  }
  //console.log('Typesetting '+ (++n));
  mjAPI.typeset({
    html: document.body.innerHTML,
    renderer: "NativeMML",
    inputs: ['AsciiMath','TeX','MathML'],
    equationNumbers: false,
    singleDollars: false,
    removeJax: false,
    addPreview: true, //argv.preview,
    speakText: false,
    speakRuleset: null,//argv.speechrules.replace(/^chromevox$/i, "default"),
    speakStyle: null,//argv.speechstyle,
    //ex: 6,//px argv.ex,
    //width: 100, //argv.width,
    xmlns: xmlns
  }, function(result) {
    //console.log('Done typesetting '+(--n));
    if (isFragment) {
      callback(result.html);
    } else {
      document.body.innerHTML = result.html;
      var HTML = '<!DOCTYPE html>\n' +
                 document.documentElement.outerHTML.replace(/^(\n|\s)*/, '');
      callback(HTML);
    }
  });
}

/**
 * Look up the MathML namespace from the <html> attributes
 */
function getXMLNS(document) {
  var html = document.head.parentNode;
  for (var i = 0, m = html.attributes.length; i < m; i++) {
    var attr = html.attributes[i];
    if (attr.nodeName.substr(0, 6) === 'xmlns:' &&
        attr.nodeValue === 'http://www.w3.org/1998/Math/MathML') {
      return attr.nodeName.substr(6);
    }
  }
  return 'mml';
}

module.exports = function() {
  //if (!transformFn) {
  //  throw new PluginError(PLUGIN_NAME,
  //    PLUGIN_NAME +
  //    ': Missing transform function!');
  //}
  return through2.obj(function(file, enc, cb) {
    //if (file.isStream()) {
    //  return this.emit('error',
    //    new PluginError(
    //      PLUGIN_NAME,
    //      PLUGIN_NAME + ': Streaming not supported'));
    //}
    var self = this;
    var done = function(data) {
      return cb();
    };
    try {
      if (file.isBuffer()) {
        processHTML(String(file.contents), function(data){
          file.contents = new Buffer(data);
          self.push(file);
          cb();
        });
      } else if (file.isStream()) {
        throw 'Doesn\'t support streams';
      }
    } catch (e) {
      console.log(chalk.red(e));
      return this.emit('error',
        new PluginError(
          PLUGIN_NAME,
          PLUGIN_NAME + ': Unable to transform "' + file.path +
          '" maybe it\'s not a valid HTML file.'));
    }
  });
};
