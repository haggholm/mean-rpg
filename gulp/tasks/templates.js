'use strict';

var gulp = require('gulp')
  , gulpif = require('gulp-if')
  , plumber = require('gulp-plumber')
  , uglify = require('gulp-uglify');
var config = require('../config');


module.exports = gulp.task('templates', function() {
  var htmlmin = require('gulp-htmlmin')
    , ngTemplates = require('gulp-angular-templatecache')
    , replace = require('gulp-replace');
  return gulp.src(['src/client/templates/{,**}/*.html'])
    .pipe(plumber())
    .pipe(gulpif(config.uglify, htmlmin(config.htmlmin)))
    // https://github.com/kangax/html-minifier/issues/316
    .pipe(gulpif(config.uglify, replace('[{htmlmin-lb}]', '\n')))
    .pipe(ngTemplates({
      module: 'meanrpgclient',
      templateHeader: 'require("angular")' +
                      '.module("<%= module %>"<%= standalone %>)' +
                      '.run(["$templateCache", function($templateCache) {'
    }))
    .pipe(gulpif(config.uglify, uglify()))
    .pipe(gulp.dest('.tmp'));
});
