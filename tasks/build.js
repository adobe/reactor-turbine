'use strict';

var webpack = require('webpack-stream');
var DefinePlugin = require('webpack').DefinePlugin;
var path = require('path');

module.exports = function(gulp) {
  gulp.task('turbine:build', function() {
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
        ],
        // npm 2 compatibility. If this weren't here, webpack would look for loaders in the
        // node_modules directly under the project requiring turbine. We want to look under
        // the turbine's node_modules. In npm 3, they're the same directory since
        // turbine's node_modules is a symlink to the project's node_modules.
        resolveLoader: {
          root: path.join(__dirname, '../node_modules')
        }
      }))
      .pipe(gulp.dest(path.join(__dirname, '../dist')));
  });
};
