'use strict';

var gulp = require('gulp');
require('./index.js')(gulp);
require('turbine-gulp-testrunner')(gulp);
require('turbine-gulp-builder')(gulp);
