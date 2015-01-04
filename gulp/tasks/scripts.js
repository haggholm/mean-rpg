'use strict';

var _ = require('lodash')
  , buffer = require('vinyl-buffer')
  , chalk = require('chalk')
  , gulp = require('gulp')
  , gulpif = require('gulp-if')
  , path = require('path')
  , sourceStream = require('vinyl-source-stream')
  , uglify = require('gulp-uglify');
var config = require('../config');


var getBundleName = function() {
  var name = require('../../package.json').name;
  return name + '.' /*+ version + '.'*/ + 'min';
};


module.exports = gulp.task('scripts', ['templates'], function() {
  var browserify = require('browserify')
    , gutil = require('gulp-util')
    , sourcemaps = require('gulp-sourcemaps')
    , watchify = require('watchify');
  var bundler = browserify(_.extend({
    //entries: ['index.js'],
    //debug: config.sourcemaps,
    ////basedir: 'src/client',
    //commondir: 'src/client',
    ////dest: 'build',
    //paths: ['src/client', '.tmp']

    entries: ['index.js'],
    debug: config.sourcemaps,
    commondir: 'src/client',
    paths: ['src/client', '.tmp']
  }, watchify.args));
  bundler.external('./lib');
  _.forEach(config.libs, function(l){ bundler.external(l.name); });

  if (config.dev) {
    console.log(config.logTimestamp() + chalk.green('Watchifying scripts'));
    bundler = watchify(bundler);

    var rebundle = function () {
      config.log(chalk.green('{Watch,Browser}ify rebundling scripts'));

      return bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify error'))
        .pipe(sourceStream(getBundleName() + '.js'))
        .pipe(buffer())
        .pipe(gulpif(config.sourcemaps, sourcemaps.init({loadMaps: true})))
        .pipe(gulpif(config.uglify, uglify()))
        .pipe(gulpif(config.sourcemaps, sourcemaps.write('sourcemaps')))
        .pipe(gulp.dest('build/'));
    };
    bundler.on('update', rebundle);
    return rebundle();
  } else {
    return bundler.bundle()
      .pipe(sourceStream(getBundleName() + '.js'))
      .pipe(buffer())
      .pipe(gulpif(config.sourcemaps, sourcemaps.init({loadMaps: true})))
      .pipe(gulpif(config.uglify, uglify()))
      .pipe(gulpif(config.sourcemaps, sourcemaps.write('sourcemaps')))
      .pipe(gulp.dest('build/'));
  }
});
