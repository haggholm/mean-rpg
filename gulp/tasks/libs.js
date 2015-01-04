'use strict';

var _ = require('lodash')
  , buffer = require('vinyl-buffer')
  , gulp = require('gulp')
  , gulpif = require('gulp-if')
  , sourceStream = require('vinyl-source-stream')
  , uglify = require('gulp-uglify');
var config = require('../config');

module.exports = gulp.task('libs', function() {
  var browserify = require('browserify')
    , sourcemaps = require('gulp-sourcemaps')
    , watchify = require('watchify');
  var bundler = browserify(_.extend({
    entries: ['lib.js'],
    debug: config.libmaps,
    commondir: 'src/client',
    paths: ['src/client']
  }, watchify.args));
  _.forEach(config.libs, function(l) {
    bundler.require(l.src || l.name, {expose: l.name});
  });

  return bundler.bundle()
    .pipe(sourceStream('lib.js'))
    .pipe(buffer())
    .pipe(gulpif(config.libmaps, sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(config.uglify, uglify()))
    .pipe(sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest('build/'));
});
