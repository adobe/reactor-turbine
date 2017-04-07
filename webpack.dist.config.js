'use strict';
const webpack = require('webpack');
const fs = require('fs');
const argv = require('yargs').argv;

const banner = fs.readFileSync('./copyrightBanner.txt', 'utf8');

const config = {
  entry: './src/bootstrap.js',
  output: {
    path: './dist',
    filename: argv.compress ? 'engine.min.js' : 'engine.js'
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

if (argv.compress) {
  config.plugins.unshift(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;
