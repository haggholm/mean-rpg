'use strict';

var gulp = require('gulp')
  , gulpif = require('gulp-if')
  , mathjaxify = require('../../mathjaxify')
  , plumber = require('gulp-plumber')
  , uglify = require('gulp-uglify');
var config = require('../config');


module.exports = gulp.task('templates', function() {
  var htmlmin = require('gulp-htmlmin')
    , ngTemplates = require('gulp-angular-templatecache')
    , replace = require('gulp-replace');

  return gulp.src(['src/client/templates/{,**}/*.html'])
    .pipe(plumber())
    .pipe(mathjaxify())
    .pipe(gulpif(config.uglify, htmlmin(config.htmlmin)))
    // https://github.com/kangax/html-minifier/issues/316
    .pipe(gulpif(config.uglify, replace('[{htmlmin-lb}]', '\n')))

    // Copy templates into output dir...
    .pipe(gulp.dest('build/templates'))

    // ...Then create the template cache file and output it, too.
    .pipe(ngTemplates({
      module: 'meanrpgclient',
      root: '/templates'
    }))
    //.pipe(gulpif(config.uglify, uglify()))
    .pipe(gulp.dest('build'));
});
