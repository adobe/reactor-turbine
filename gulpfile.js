'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var path = require('path');
var KarmaServer = require('karma').Server;
var webpack = require('webpack-stream');
var DefinePlugin = require('webpack').DefinePlugin;

var $ = require('gulp-load-plugins')();

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

function startKarma(processor) {
  var options = {
    configFile: path.join(__dirname, 'karma.conf.js'),
    webpack: {
      devtool: '#inline-source-map',
      externals: [
        {
          // So that modules can require('window') and then tests can mock it.
          window: 'window',
          document: 'document'
        }
      ]
    }
  };

  if (processor) {
    processor(options);
  }

  new KarmaServer(options).start();
}

// Typically we wouldn't be dependent upon building the full engine and config (by running the
// "default" task first) since Karma would dynamically compile the pieces under test, but because
// we have functional tests that work within iframes and are dependent upon the full engine and
// config, this is necessary.
gulp.task('test', ['default'], function() {
  startKarma();
});

gulp.task('coverage', ['default'], function() {
  startKarma(function(options) {
    options.webpack.module = {
      preLoaders: [{
        test: /\.js$/,
        exclude: /(__tests__)\//,
        loader: 'istanbul-instrumenter'
      }]
    };
    options.reporters = ['progress', 'coverage'];
    options.singleRun = true;
  });
});

gulp.task('testall', ['default'], function() {
  startKarma(function(options) {
    options.browsers = [
      'Chrome',
      'Firefox',
      'Safari',
      'IE9 - Win7',
      'IE10 - Win7',
      'IE11 - Win7'
    ];
  });
});

gulp.task('watch', function() {
  gulp.watch(['./src/{,**/!(__tests__)}/*.js'], ['buildEngine']);
});

gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe($.eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe($.eslint.format('stylish'))
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe($.eslint.failAfterError());
});

gulp.task('default', ['buildEngine', 'watch']);
