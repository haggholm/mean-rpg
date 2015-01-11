'use strict';

var _ = require('lodash')
  , addsrc = require('gulp-add-src')
  , buffer = require('vinyl-buffer')
  , concat = require('gulp-concat')
  , fs = require('fs')
  , gulp = require('gulp')
  , gulpif = require('gulp-if')
  , path = require('path')
  , plumber = require('gulp-plumber')
  , sourceStream = require('vinyl-source-stream')
  , uglify = require('gulp-uglify');
var config = require('../config');


var buildLibs = function() {
  var browserify = require('browserify')
    , sourcemaps = require('gulp-sourcemaps')
    , watchify = require('watchify');
  var bundler = browserify(_.extend({
    entries: ['lib.js'],
    debug: config.libmaps,
    commondir: 'src/client',
    paths: ['src/client']
  }, watchify.args));

  _.forEach([
    'es5-shim',
    'lodash',
    'jquery',
    'hypher',
    'hyphenation.en-us',
    'numeral'
  ], function(l) {
    bundler.require(l, {expose: l});
  });

  //var libBundleStream = bundler.bundle()
  //  .pipe(sourceStream('lib.js'))
  //  .pipe(plumber())
  //  .pipe(buffer())
  //  .pipe(gulpif(config.libmaps, sourcemaps.init({loadMaps: true})))
  //  .pipe(gulpif(config.uglify, uglify()))
  //  .pipe(sourcemaps.write('sourcemaps'))
  //  .pipe(gulp.dest('build/'));

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
  var ngModules = [
    'node_modules/angular/angular.min.js',
    'node_modules/angular-nvd3/dist/angular-nvd3.min.js',
    'node_modules/angular-resource/angular-resource.min.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js'
  ];
  var otherModules = ['node_modules/bootstrap/dist/js/bootstrap.min.js'];

  return bundler.bundle()
    .pipe(sourceStream('lib.js'))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(gulpif(config.libmaps, sourcemaps.init({loadMaps: true})))
    .pipe(addsrc.append([].concat(d3modules, ngModules, otherModules)))
    .pipe(gulpif(config.uglify, uglify()))
    .pipe(concat('lib.js'))
    .pipe(gulpif(config.libmaps, sourcemaps.write('sourcemaps')))
    .pipe(gulp.dest('.cache/'));

  //var d3stream = gulp.src(d3modules)
  //  .pipe(plumber())
  //  .pipe(gulpif(config.libmaps, sourcemaps.init({loadMaps: true})))
  //  .pipe(concat('d3-libs.js'))
  //  // No need to uglify if the libs are already minified
  //  .pipe(gulpif(config.uglify, uglify()))
  //  .pipe(sourcemaps.write('sourcemaps'))
  //  .pipe(gulp.dest('build/'));
  //
  //return require('merge-stream')(
  //  libBundleStream,
  //  d3stream
  //);
};

gulp.task('build-libs', buildLibs);

if (fs.existsSync('.cache/lib.js')) {
  module.exports = gulp.task('libs', function() {
    return gulp.src(['.cache/lib.js*'])
      .pipe(gulp.dest('build'));
  });
} else {
  module.exports = gulp.task('libs', ['build-libs']);
}

module.external = [
  'es5-shim',
  'lodash',
  'jquery',
  'hypher',
  'hyphenation.en-us',
  'numeral',
  'd3',
  'nv',
  'angular',
  'angular-ui-router',
  'angular-nvd3',
  'angular-resource',
  'bootstrap'
];
