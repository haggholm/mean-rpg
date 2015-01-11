'use strict';

var dev = true;
module.exports = {
  dev: dev,
  debug: true,
  port: 9000,
  sourcemaps: true,
  libmaps: false,
  uglify: true,//!dev,
  watching: dev,
  libs: [
    {name: 'es5-shim'},
    {name: 'lodash'},
    {name: 'jquery'},
    {name: 'hypher'},
    {name: 'hyphenation.en-us'},
    {name: 'numeral'}
  ],
  htmlmin: {
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    // Needs htmlmin >0.6.9 to get rid of htmlmin-lb bug
    preserveLineBreaks: false,
    removeScriptTypeAttributes: true
  },
  paths: {
    images: 'src/client/{,**}.{jpg,jpeg,png,gif}',
    index: 'src/client/index.html',
    fonts: [
      'node_modules/font-awesome/fonts/*.{otf,eot,svg,ttf,woff}',
      'src/client/mathjax-fonts/**'
      //'git_modules/MathJax/fonts/**'
    ],
    less: 'src/client/{,**}/*.{less,css}',
    scripts: ['src/client/{,**}/*.js', 'src/lib/{,**}/*.js'],
    templates: 'src/client/templates/{,**}/*.html'
  },
  logTimestamp: function () {
    var chalk = require('chalk');
    return chalk.white('[') +
           chalk.grey(new Date().toTimeString().substr(0, 8)) +
           chalk.white('] ');
  },
  log: function(str) {
    console.log(module.exports.logTimestamp() + str);
  },
  path: function(pth) {
    return require('path').join(__dirname, '..', pth);
  }
};
