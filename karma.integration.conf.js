'use strict';

const path = require('path');

module.exports = function (config) {
  config.set({
    // Test framework
    frameworks: ['jasmine'],

    // Files to load in browser
    files: [
      {
        pattern: 'test.integrationIndex.js',
        watched: false,
        included: true,
        served: true
      },
      {
        pattern: 'dist/engine.js',
        watched: false,
        included: false, // Don’t auto-inject it; your test loads it dynamically
        served: true
      }
    ],

    // Preprocess with webpack
    preprocessors: {
      'test.integrationIndex.js': ['webpack']
    },

    // Webpack config
    webpack: {
      mode: 'development',
      resolve: {
        extensions: ['.js', '.jsx']
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            include: path.resolve('src'),
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/env', { targets: '> 0.25%, not dead' }]],
                plugins: []
              }
            }
          }
        ]
      }
    },

    // Browser to run tests in
    browsers: [process.env.CI ? 'ChromeHeadless' : 'Chrome'],

    // Exit after running tests
    singleRun: true,

    // Logging level
    logLevel: config.LOG_INFO
  });
};
