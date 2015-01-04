'use strict';

var gulp = require('gulp');
var config = require('../config');


module.exports = gulp.task('watch', ['build'], function() {
  gulp.watch(config.paths.templates, ['templates']);
  gulp.watch(config.paths.index, ['html']);
  gulp.watch(config.paths.images, ['images']);
  gulp.watch(config.paths.less, ['less']);
});
