'use strict';

// My computer is slow, and MathJax can time out.
// Let's start it loading ASAP.
require('./mathjaxify');

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
require('./gulp/tasks/scripts');
require('./gulp/tasks/templates');
require('./gulp/tasks/watch');


var gulp = require('gulp')
  , rename = require('gulp-rename');
require('clean-css');


gulp.task('build',
  ['libs', 'scripts', 'fonts', 'images', 'less', 'html', 'templates']);


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
