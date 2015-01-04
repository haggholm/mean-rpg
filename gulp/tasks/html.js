'use strict';

var gulp = require('gulp')
  , gulpif = require('gulp-if')
  , plumber = require('gulp-plumber');
var config = require('../config');


module.exports = gulp.task('html', function() {
  var htmlmin = require('gulp-htmlmin');
  return gulp.src(config.paths.index, {base: 'src/client'})
    .pipe(plumber())
    .pipe(gulpif(config.uglify, htmlmin(config.htmlmin)))
    .pipe(gulp.dest('./build'));
});
