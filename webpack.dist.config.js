'use strict';
const webpack = require('webpack');
const fs = require('fs');

const banner = fs.readFileSync('./copyrightBanner.txt', 'utf8');

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
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin(banner, {
      raw: true
    })
  ],
  externals: {
    // So that modules can require('window') and then tests can mock it.
    window: 'window',
    document: 'document'
  }
};
