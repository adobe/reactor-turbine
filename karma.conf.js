var RewirePlugin = require('rewire-webpack');

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      // need to figure out how to get webpack to take a glob w/o duplicating
      // stuff everywhere
      '**/__tests__/*.js'
    ],

    exclude: [],

    preprocessors: {
      '**/__tests__/*.js': ['webpack']
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
