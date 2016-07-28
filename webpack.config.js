'use strict';

module.exports = {
  entry: './src/bootstrap.js',
  output: {
    path: './dist',
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
  }
};
