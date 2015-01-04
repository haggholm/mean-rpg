'use strict';

var gulp = require('gulp')
  , gulpif = require('gulp-if')
  , uglify = require('gulp-uglify');
var config = require('../config');


module.exports = gulp.task('mathjax', function() {
  var merge = require('merge-stream');

  var scriptStream = gulp.src([
    'git_modules/MathJax/MathJax.js',
    'git_modules/MathJax/config/**',
    'git_modules/MathJax/extensions/**',
    'git_modules/MathJax/jax/element/**',
    'git_modules/MathJax/jax/input/TeX/**',
    'git_modules/MathJax/jax/output/NativeMML/**',
    'git_modules/MathJax/jax/output/HTML-CSS/*.js',
    'git_modules/MathJax/jax/output/HTML-CSS/autoload/**',
    'git_modules/MathJax/jax/output/HTML-CSS/fonts/{STIX,STIX-Web}/**'
  ], {base: 'git_modules'})
    .pipe(gulpif(config.uglify, uglify()))
    .pipe(gulp.dest('./build/'));

  var fontStream = gulp.src([
    'git_modules/MathJax/fonts/HTML-CSS/{STIX,STIX-Web}/**'
  ], {base: 'git_modules'})
    .pipe(gulp.dest('./build/'));

  return merge(scriptStream, fontStream);
});
