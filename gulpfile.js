'use strict';

var chalk = require('chalk')
  , config = require('./gulp/config');

config.log(chalk.cyan('Loading gulp tasks'));
require('./gulp/tasks/clean');
require('./gulp/tasks/connect');
require('./gulp/tasks/fonts');
require('./gulp/tasks/html');
require('./gulp/tasks/images');
require('./gulp/tasks/less');
require('./gulp/tasks/libs');
require('./gulp/tasks/mathjax');
require('./gulp/tasks/scripts');
require('./gulp/tasks/templates');
require('./gulp/tasks/watch');


var gulp = require('gulp')
  , rename = require('gulp-rename');
require('clean-css');


gulp.task('build', function() {
  return require('run-sequence')(
    'clean',
    ['mathjax', 'libs', 'scripts', 'fonts', 'images', 'less', 'html']
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
