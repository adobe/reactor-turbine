'use strict';
const webpack = require('webpack');
const fs = require('fs');

const banner = fs.readFileSync('./copyrightBanner.txt', 'utf8');

module.exports = {
  entry: './src/lib/require.js',
  output: {
    path: __dirname + '/lib',
    filename: 'require.js',
    libraryTarget: 'commonjs2'
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
    window: 'var window',
    document: 'var document'
  }
};
