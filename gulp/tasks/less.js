'use strict';

var gulp = require('gulp')
  , gulpif = require('gulp-if')
  , plumber = require('gulp-plumber');
var config = require('../config');


module.exports = gulp.task('less', function() {
  var less = require('gulp-less')
    , sourcemaps = require('gulp-sourcemaps')
    , LessPluginCleanCSS = require('less-plugin-clean-css')
    , LessPluginAutoPrefix = require('less-plugin-autoprefix');
  return gulp.src('src/client/index.less')
    .pipe(plumber())
    .pipe(gulpif(config.sourcemaps, sourcemaps.init()))
    .pipe(less({
      plugins: [
        new LessPluginAutoPrefix({browsers: ['last 2 versions']})
      ].concat(
        config.uglify ? [new LessPluginCleanCSS({advanced: true})] : []),
      ieCompat: false,
      strictImports: true
    }))
    .pipe(gulpif(config.sourcemaps, sourcemaps.write('./sourcemaps')))
    .pipe(gulp.dest('./build'));
});
