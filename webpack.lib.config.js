'use strict';
const webpack = require('webpack');

module.exports = {
  entry: './src/lib/require.js',
  output: {
    path: './lib',
    filename: 'require.js',
    libraryTarget: 'commonjs2'
  },
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
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],
  externals: {
    window: 'var window',
    document: 'var document'
  }
};
