'use strict';

var webpack = require('webpack-stream');
var DefinePlugin = require('webpack').DefinePlugin;
var path = require('path');

module.exports = function(gulp) {
  gulp.task('buildEngine', function() {
    return gulp.src(path.join(__dirname, '../src/bootstrap.js'))
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
      .pipe(gulp.dest('dist'));
  });
};
