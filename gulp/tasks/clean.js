'use strict';

var gulp = require('gulp')
  , del = require('del');


module.exports = gulp.task('clean', function(cb) {
  del(['build', 'dist', '.tmp'], cb);
});
