// jshint node:true
'use strict';

var browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    del = require('del'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    gzip = require('gulp-gzip'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    less = require('gulp-less'),
//    livereload = require('gulp-livereload'),
//    merge = require('merge-stream'),
    ngTemplates = require('gulp-angular-templatecache'),
//    path = require('path'),
    rename = require('gulp-rename'),
    revall = require('gulp-rev-all'),
    runSequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify')
  , plumber = require('gulp-plumber');

require('clean-css');

var paths = {
  images: 'src/client/{,**}.{jpg,jpeg,png,gif}',
  index: 'src/client/index.html',
  less: 'src/client/{,**}/*.{less,css}',
  scripts: ['src/client/{,**}/*.js', 'src/lib/{,**}/*.js'],
  templates: 'src/client/templates/{,**}/*.html'
};

var opts = {
  htmlmin: {
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    preserveLineBreaks: true,
    removeScriptTypeAttributes: true
  }
};

var config = {
  debug: true,
  port: 9000,
  sourcemaps: false,
  uglify: true
};

gulp.task('clean', function(cb) {
  del(['build', 'dist'], cb);
});

gulp.task('scripts', function() {
    gulp.src(['src/client/index.js'])
      .pipe(plumber())
      .pipe(gulpif(config.sourcemaps, sourcemaps.init()))
      .pipe(browserify({
        transform: ['browserify-ngannotate'],
        shim: {
          angular: {
            path: 'node_modules/angular/angular.min.js',
            exports: 'angular'
          },
          'angular-resource': {
            path: 'node_modules/angular-resource/angular-resource.min.js',
            exports: 'ngResource',
            depends: { angular: 'angular' }
          },
          'angularjs-nvd3-directives': {
            path: 'node_modules/angularjs-nvd3-directives/' +
                  'dist/angularjs-nvd3-directives.js',
            exports: null,
            depends: { angular: 'angular' }
          },
          'es5-shim': {
            path: 'node_modules/es5-shim/es5-shim.js',
            exports: null
          }
        },
        debug: config.sourcemaps
      }))
      .pipe(concat('index.js'))
      .pipe(gulpif(config.uglify, uglify()))
      .pipe(gulpif(config.sourcemaps, sourcemaps.write('./sourcemaps')))
      .pipe(gulp.dest('./build'));
});

gulp.task('templates', function() {
  gulp.src(['src/client/templates/{,**}/*.html'])
    .pipe(plumber())
    .pipe(gulpif(config.uglify, htmlmin(opts.htmlmin)))
    .pipe(ngTemplates({module: 'meanrpgclient'}))
    .pipe(gulpif(config.uglify, uglify()))
    .pipe(gulp.dest('./build'));
});

gulp.task('images', function() {
  gulp.src(paths.images)
    .pipe(plumber())
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true }))
    .pipe(gulp.dest('./build'));
});

gulp.task('less', function() {
  gulp.src('src/client/index.less')
    .pipe(plumber())
    .pipe(gulpif(config.sourcemaps, sourcemaps.init()))
    .pipe(less({
      cleancss: config.uglify,
//      compress: config.uglify,
      ieCompat: false,
      strictImports: true
    }))
    .pipe(gulpif(config.sourcemaps, sourcemaps.write('./sourcemaps')))
    .pipe(gulp.dest('./build'));
});


gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.templates, ['templates']);
  gulp.watch(paths.index, ['html']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.less, ['less']);
});

gulp.task('html', function() {
  gulp.src(paths.index)
    .pipe(plumber())
    .pipe(gulpif(config.uglify, htmlmin(opts.htmlmin)))
    .pipe(gulp.dest('./build'));
});

gulp.task('connect', function() {
  connect.server({
    root: ['./build'],
    port: config.port,
    livereload: true
  });
});

gulp.task('build', function() {
  return runSequence(
    'clean',
    ['scripts', 'images', 'templates', 'less', 'html']
//    'postprocess',
//    'cdnize'
  );
});


gulp.task('package', ['build'], function() {
  return gulp.src(['./build/**'])
    .pipe(revall())
    .pipe(rename(function (path) {
      if (/index[-\.]\w+/.test(path.basename) && path.extname === '.html') {
        path.basename = 'index';
      }
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(gzip())
    .pipe(gulp.dest('./dist'));
});

//gulp.task('build', ['scripts', 'images', 'templates', 'less', 'html']);
gulp.task('default', ['build', 'watch',  'connect']);
