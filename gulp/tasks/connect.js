'use strict';

var gulp = require('gulp')
  , connect = require('gulp-connect');
var config = require('../config');


module.exports = gulp.task('connect', ['build'], function() {
  return connect.server({
    root: ['./build'],
    port: config.port,
    livereload: true
  });
});
