// jshint node:true
'use strict';

var _ = require('lodash')
  , browserify = require('browserify')
  , buffer = require('vinyl-buffer')
//, concat = require('gulp-concat')
  , connect = require('gulp-connect')
  , del = require('del')
  , fs = require('fs')
  , gulp = require('gulp')
  , gulpif = require('gulp-if')
  , gutil = require('gulp-util')
  , gzip = require('gulp-gzip')
  , htmlmin = require('gulp-htmlmin')
  , imagemin = require('gulp-imagemin')
  , less = require('gulp-less')
  , ngTemplates = require('gulp-angular-templatecache')
  , rename = require('gulp-rename')
  , revall = require('gulp-rev-all')
  , runSequence = require('run-sequence')
  , sourcemaps = require('gulp-sourcemaps')
  , sourceStream = require('vinyl-source-stream')
  , uglify = require('gulp-uglify')
  , plumber = require('gulp-plumber')
  , watchify = require('watchify');
require('uglifyify');
require('clean-css');

var paths = {
  images: 'src/client/{,**}.{jpg,jpeg,png,gif}',
  index: 'src/client/index.html',
  fonts: [
    'node_modules/font-awesome/fonts/*.{otf,eot,svg,ttf,woff}',
    'git_modules/MathJax/fonts/**'
  ],
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
    // Needs htmlmin >0.6.9 to get rid of htmlmin-lb bug
    preserveLineBreaks: false,
    removeScriptTypeAttributes: true
  }
};

var dev = true;
var config = {
  debug: true,
  port: 9000,
  sourcemaps: true,
  uglify: !dev,
  watching: dev
};

gulp.task('clean', function(cb) {
  del(['build', 'dist'], cb);
});

var getBundleName = function() {
  //var version = require('./package.json').version;
  var name = require('./package.json').name;
  return name + '.' /*+ version + '.'*/ + 'min';
};


gulp.task('mathjax', function() {
  return gulp.src([
    'git_modules/MathJax/extensions/**',
    'git_modules/MathJax/jax/element/**',
    'git_modules/MathJax/jax/input/{MathML,TeX}/**',
    'git_modules/MathJax/jax/output/{HTML-CSS,NativeMML}/**'
  ]).pipe(uglify())
    .pipe(gulp.dest('./build/'));
});

var libs = {
  angular: './node_modules/angular/angular.min.js',
  'angular-ui-router':
    './node_modules/angular-ui-router/release/angular-ui-router.min.js',
  'bootstrap': './node_modules/bootstrap/dist/js/bootstrap.min.js',
  'd3-browserify': './node_modules/d3-browserify/d3.js',
  'es5-shim': './node_modules/es5-shim/es5-shim.min.js',
  'jquery': './node_modules/jquery/dist/jquery.min.js',
  'lodash': './node_modules/lodash/dist/lodash.min.js',
  'mathjax': './git_modules/MathJax/MathJax.js',
  'nvd3': './node_modules/nvd3/build/nv.d3.min.js'
};
_.forEach(require('./package.json').browser, function(path, alias){
  libs[alias] = path;
});

gulp.task('libs', function() {
  var bundler = browserify();
  _.forEach(libs, function(path, alias) {
    bundler = bundler.require(require.resolve(path), {expose: alias});
  });
  return bundler.bundle(function(err, libs) {
    fs.writeFile('./build/libs.js', libs);
  });
});


gulp.task('scripts', function() {
  var bundler = browserify({
    entries: ['./src/client/index.js'],
    debug: config.sourcemaps,
    paths: ['./node_modules', './src/client']
  });
  if (false) {
    bundler = watchify(bundler, watchify.args);
  }

  _.forEach(libs, function(path, alias){
    bundler = bundler.external(alias);
  });

  bundler.transform({
    global: true,
    ignore: '**/*.min.js'
  }, 'uglifyify');

  bundler.on('update', rebundle);
  function rebundle() {
    return bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify error'))
      .pipe(plumber())
      .pipe(sourceStream(getBundleName() + '.js'))
      //.pipe(buffer())
      //.pipe(gulpif(config.sourcemaps, sourcemaps.init({loadMaps: true})))
      // Add transformation tasks to the pipeline here.
      //.pipe(uglify())

      //.pipe(gulpif(config.sourcemaps, sourcemaps.write('.')))
      .pipe(gulp.dest('./build'));
  }

  return rebundle();
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
      interlaced: true
    }))
    .pipe(gulp.dest('./build'));
});


gulp.task('fonts', function() {
  gulp.src(paths.fonts)
    .pipe(plumber())
    .pipe(gulp.dest('./build/fonts'));
});


gulp.task('less', function() {
  gulp.src('src/client/index.less')
    .pipe(plumber())
    .pipe(gulpif(config.sourcemaps, sourcemaps.init()))
    .pipe(less({
      cleancss: config.uglify,
      ieCompat: false,
      strictImports: true
    }))
    .pipe(gulpif(config.sourcemaps, sourcemaps.write('./sourcemaps')))
    .pipe(gulp.dest('./build'));
});


gulp.task('watch', function() {
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
    ['mathjax', 'libs', 'scripts', 'templates',
     'fonts', 'images', 'less', 'html']
//    'postprocess',
//    'cdnize'
  );
});


gulp.task('package', ['build'], function() {
  return gulp.src(['./build/**'])
    .pipe(revall())
    .pipe(rename(function(path) {
      if (/index[-\.]\w+/.test(path.basename) && path.extname === '.html') {
        path.basename = 'index';
      }
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(gzip())
    .pipe(gulp.dest('./dist'));
});

//gulp.task('build', ['scripts', 'images', 'templates', 'less', 'html']);
gulp.task('default', ['build', 'watch', 'connect']);
