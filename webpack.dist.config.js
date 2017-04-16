'use strict';
const webpack = require('webpack');
const fs = require('fs');

const banner = fs.readFileSync('./copyrightBanner.txt', 'utf8');

module.exports = function (env) {
  const config = {
    entry: './src/bootstrap.js',
    output: {
      path: __dirname + '/dist',
      filename: env.compress ? 'engine.min.js' : 'engine.js'
    },
    resolve: {
      extensions: ['.js']
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'strict-loader'
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: banner,
        raw: true
      })
    ],
    externals: {
      // So that modules can require('window') and then tests can mock it.
      window: 'window',
      document: 'document'
    }
  };

  if (env.compress) {
    config.plugins.unshift(new webpack.optimize.UglifyJsPlugin());
  }

  return config;
};
