#!/usr/bin/env node

'use strict';

var webpack = require('webpack');
var path = require('path');

var compiler = webpack({
  entry: path.join(__dirname, '../src/bootstrap.js'),
  output: {
    path: path.join(__dirname, '../dist'),
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
  // Maybe no longer needed?
  // npm 2 compatibility. If this weren't here, webpack would look for loaders in the
  // node_modules directly under the project requiring turbine. We want to look under
  // the turbine's node_modules. In npm 3, they're the same directory since
  // turbine's node_modules is a symlink to the project's node_modules.
  resolveLoader: {
    root: path.join(__dirname, '../node_modules')
  }
});

compiler.run(function(){});
