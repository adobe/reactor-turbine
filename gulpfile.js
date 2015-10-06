'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var webpack = require('webpack-stream');
var DefinePlugin = require('webpack').DefinePlugin;
require('turbine-gulp-testrunner')(gulp);

gulp.task('buildEngine', function() {
  return gulp.src('./src/bootstrap.js')
    .pipe(webpack({
      output: {
        filename: 'engine.js'
      },
      //devtool: 'source-map', // Doesn't match the right lines in the debugger half the time. :/
      resolve: {
        extensions: ['', '.js']
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'strict'
          }
        ]
      },
      externals: {
        // So that modules can require('window') and then tests can mock it.
        window: 'window',
        document: 'document'
      },
      plugins: [
        new DefinePlugin({
          ENV_TEST: true
        })
      ]
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('compressEngine', ['buildEngine'], function() {
  return gulp.src('./dist/engine.js')
    .pipe(rename('engine.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(gzip())
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  gulp.watch(['./src/{,**/!(__tests__)}/*.js'], ['buildEngine']);
});

gulp.task('default', ['buildEngine', 'watch']);
