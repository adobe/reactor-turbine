var RewirePlugin = require('rewire-webpack');

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      { pattern: 'src/__tests__/loadTestpage.js', watched: true, included: true, served: true },
      { pattern: '**/__tests__/**/*.test.js', watched: true, included: true, served: true },
      { pattern: '**/__tests__/**/*.test.html', watched: true, included: false, served: true },
      { pattern: 'src/__tests__/testpage.js', watched: true, included: false, served: true },
      { pattern: 'dist/config.js', watched: true, included: false, served: true },
      { pattern: 'dist/engine.js', watched: true, included: false, served: true }
    ],

    exclude: [],

    preprocessors: {
      '**/__tests__/*.test.js': ['webpack']
    },

    webpack: {
      plugins: [
        new RewirePlugin()
      ]
    },

    webpackServer: {
      stats: {
        colors: true
      }
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    captureTimeout: 60000,

    singleRun: false,

    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-firefox-launcher"),
      require("karma-webpack")
    ]
  });
};
