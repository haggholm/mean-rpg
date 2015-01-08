'use strict';

var _ = require('lodash')
  , buffer = require('vinyl-buffer')
  , concat = require('gulp-concat')
  , gulp = require('gulp')
  , gulpif = require('gulp-if')
  , path = require('path')
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

  var clientLibModule = path.join(__dirname, '../../src/client/lib.js');
  _.forEach(_.keys(require(clientLibModule)), function(l) {
    bundler.require(l, {expose: l});
  });

  var libBundleStream = bundler.bundle()
    .pipe(sourceStream('lib.js'))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(gulpif(config.libmaps, sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(config.uglify, uglify()))
    .pipe(sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest('build/'));

  var d3modules = ['node_modules/d3/d3.min.js'].concat(
    _.map([
      'core.js',
      'interactiveLayer.js',
      'tooltip.js',
      'utils.js',
      'models/axis.js',
      //'models/discreteBar.js',
      //'models/discreteBarChart.js',
      'models/legend.js',
      'models/multiBar.js',
      'models/multiBarChart.js',
      'models/multiBarHorizontal.js',
      'models/multiBarHorizontalChart.js'
      // nvd3 by default includes 'models/*.js'.
    ], function(pth) { return 'node_modules/nvd3/src/'+pth; })
  );
  var d3stream = gulp.src(d3modules)
    .pipe(plumber())
    .pipe(gulpif(config.libmaps, sourcemaps.init({loadMaps: true})))
    .pipe(concat('d3-libs.js'))
    // No need to uglify if the libs are already minified
    .pipe(gulpif(config.uglify, uglify()))
    .pipe(sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest('build/'));

  return require('merge-stream')(
    libBundleStream,
    d3stream
  );
});
