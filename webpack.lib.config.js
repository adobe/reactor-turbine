'use strict';
const webpack = require('webpack');
const fs = require('fs');

const banner = fs.readFileSync('./copyrightBanner.txt', 'utf8');

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
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin(banner, {
      raw: true
    })
  ],
  externals: {
    window: 'var window',
    document: 'var document'
  }
};
