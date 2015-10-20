'use strict';

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');

module.exports = function(gulp) {
  gulp.task('turbine:compress', ['turbine:build'], function() {
    return gulp.src('dist/engine.js')
      .pipe(rename('engine.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist'))
      .pipe(gzip())
      .pipe(gulp.dest('dist'));
  });
};
