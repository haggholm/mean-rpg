'use strict';

var chalk = require('chalk');
function logTimestamp() {
  return chalk.white('[') +
         chalk.grey(new Date().toTimeString().substr(0, 8)) +
         chalk.white('] ');
}

console.log(logTimestamp() + chalk.cyan('Loading gulp modules'));
var _ = require('lodash')
  , buffer = require('vinyl-buffer')
  , connect = require('gulp-connect')
  , del = require('del')
  , gulp = require('gulp')
  , gulpif = require('gulp-if')
  , path = require('path')
  , rename = require('gulp-rename')
  , sourceStream = require('vinyl-source-stream')
  , plumber = require('gulp-plumber')
  , uglify = require('gulp-uglify');
require('clean-css');


var paths = {
  images: 'src/client/{,**}.{jpg,jpeg,png,gif}',
  index: 'src/client/index.html',
  fonts: [
    'node_modules/font-awesome/fonts/*.{otf,eot,svg,ttf,woff}'
    //'git_modules/MathJax/fonts/**'
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
  libmaps: false,
  uglify: false,//!dev,
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
    'git_modules/MathJax/jax/output/NativeMML/**',
    'git_modules/MathJax/jax/output/HTML-CSS/*.js',
    'git_modules/MathJax/jax/output/HTML-CSS/autoload**',
    'git_modules/MathJax/jax/output/HTML-CSS/fonts/STIX/**'
    //'git_modules/MathJax/jax/output/HTML-CSS/fonts/{STIX,STIX-Web}/**'
  ], {base: 'git_modules/MathJax'})
    .pipe(gulpif(config.uglify, uglify()))
    .pipe(gulp.dest('./build/'));
});

gulp.task('libs', function() {
  var browserify = require('browserify')
    , sourcemaps = require('gulp-sourcemaps');
  var bundler = browserify({
    //entries: libs,
    debug: config.libmaps//,
    //basedir: 'src/client',
    //commondir: 'src/client'
  });
  bundler.require(require.resolve('jquery'), {expose: 'jquery'});
  _.forEach(require('./package.json').browser, function(pth, lib) {
    bundler.require(require.resolve(pth), {expose: lib});
  });

  return bundler.bundle()
    .pipe(sourceStream('lib.js'))
    .pipe(buffer())
    .pipe(gulpif(config.libmaps, sourcemaps.init({loadMaps: true})))
    // Add transformation tasks to the pipeline here.
    .pipe(gulpif(config.uglify, uglify()))

    .pipe(gulpif(config.libmaps, sourcemaps.write('./')))
    .pipe(gulp.dest('./build'));
});


gulp.task('scripts', function() {
  var browserify = require('browserify')
    , gutil = require('gulp-util')
    , sourcemaps = require('gulp-sourcemaps')
    , watchify = require('watchify');
  var bundler = browserify(_.extend({
    //entries: ['./index.js'],
    debug: config.sourcemaps,
    basedir: 'src/client',
    commondir: 'src/client',
    //dest: 'build',
    paths: _.map([
      //'node_modules',
      //'git_modules',
      'src/client'
    ], function(pth) {
      return path.join(__dirname, pth);
    })
  }, watchify.args));
  bundler.require(require.resolve('./src/client/index.js'));
  bundler.external('jquery')
  _.forEach(require('./package.json').browser, function(pth, lib){
    bundler.external(lib);
  });

  if (dev) {
    console.log(logTimestamp() + chalk.green('Watchifying scripts'));
    bundler = watchify(bundler);

    var rebundle = function () {
      console.log(logTimestamp() + chalk.green('{Watch,Browser}ify rebundling scripts'));

      return bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify error'))
        .pipe(sourceStream(getBundleName() + '.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(gulpif(config.uglify, uglify()))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/'));
    };
    bundler.on('update', rebundle);
    return rebundle();
  } else {
    return bundler.bundle()
      .pipe(sourceStream('build/' + getBundleName() + '.js'))
      .pipe(buffer())
      .pipe(gulpif(config.sourcemaps, sourcemaps.init({loadMaps: true})))
      // Add transformation tasks to the pipeline here.
      .pipe(gulpif(config.uglify, uglify()))
      .pipe(gulpif(config.sourcemaps, sourcemaps.write('./')))
      .pipe(gulp.dest('./'));
  }
});

gulp.task('templates', function() {
  var htmlmin = require('gulp-htmlmin')
    , ngTemplates = require('gulp-angular-templatecache')
    , replace = require('gulp-replace');
  gulp.src(['src/client/templates/{,**}/*.html'])
    .pipe(plumber())
    .pipe(gulpif(config.uglify, htmlmin(opts.htmlmin)))
    // https://github.com/kangax/html-minifier/issues/316
    .pipe(gulpif(config.uglify, replace('[{htmlmin-lb}]', '\n')))
    .pipe(ngTemplates({
      module: 'meanrpgclient',
      templateHeader: 'var ng = require("angular");\n' +
                      'ng.module("<%= module %>"<%= standalone %>)' +
                      '.run(["$templateCache", function($templateCache) {'
    }))
    .pipe(gulpif(config.uglify, uglify()))
    .pipe(gulp.dest('./build'));
});

gulp.task('images', function() {
  var imagemin = require('gulp-imagemin');
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
  var less = require('gulp-less')
    , sourcemaps = require('gulp-sourcemaps');
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
  var htmlmin = require('gulp-htmlmin');
  gulp.src(paths.index, {base: 'src/client'})
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
  return require('run-sequence')(
    'clean',
    ['mathjax', 'libs', 'scripts', 'templates',
     'fonts', 'images', 'less', 'html']
//    'postprocess',
//    'cdnize'
  );
});


gulp.task('package', ['build'], function() {
  var gzip = require('gulp-gzip')
    , revall = require('gulp-rev-all');
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
