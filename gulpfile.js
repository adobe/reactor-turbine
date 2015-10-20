'use strict';

var gulp = require('gulp');
require('turbine-gulp-testrunner')(gulp);
require('turbine-gulp-sandbox')(gulp);
require('./tasks/compress')(gulp);
require('./tasks/build')(gulp);
gulp.task('default', ['turbine:build']);
