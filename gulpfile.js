'use strict';

var gulp = require('gulp');
require('turbine-gulp-testrunner')(gulp);
require('turbine-gulp-sandbox')(gulp);
gulp.task('build', require('./tasks/createBuildTask')());
gulp.task('compress', ['build'], require('./tasks/compress'));
gulp.task('default', ['build']);
