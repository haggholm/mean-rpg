'use strict';

var _ = require('lodash')
  , buffer = require('vinyl-buffer')
  , concat = require('gulp-concat')
  , gulp = require('gulp')
  , gulpif = require('gulp-if')
  , plumber = require('gulp-plumber')
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

  var libBundleStream = bundler.bundle()
    .pipe(sourceStream('lib.js'))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(gulpif(config.libmaps, sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(config.uglify, uglify()))
    .pipe(sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest('build/'));

  var d3stream = gulp.src([
    'node_modules/d3/d3.min.js',
    'node_modules/nvd3/build/nv.d3.min.js'])
    .pipe(plumber())
    .pipe(gulpif(config.libmaps, sourcemaps.init({loadMaps: true})))
    .pipe(concat('d3-libs.js'))
    // No need to uglify if the libs are already minified
    //.pipe(gulpif(config.uglify, uglify()))
    .pipe(sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest('build/'));

  return require('merge-stream')(
    libBundleStream,
    d3stream
  );
});
