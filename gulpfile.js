'use strict';

var gulp = require('gulp');
require('@reactor/turbine-gulp-testrunner')(gulp);
gulp.task('build', require('./tasks/createBuildTask')());
gulp.task('compress', ['build'], require('./tasks/compress'));
gulp.task('default', ['build']);
