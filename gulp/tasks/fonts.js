'use strict';

var gulp = require('gulp')
  , plumber = require('gulp-plumber');
var config = require('../config');


module.exports = gulp.task('fonts', function() {
  return gulp.src(config.paths.fonts)
    .pipe(plumber())
    .pipe(gulp.dest('./build/fonts'));
});
