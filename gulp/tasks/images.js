'use strict';

var gulp = require('gulp')
  , plumber = require('gulp-plumber');
var config = require('../config');


module.exports = gulp.task('images', function() {
  var imagemin = require('gulp-imagemin');
  return gulp.src(config.paths.images)
    .pipe(plumber())
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./build'));
});
