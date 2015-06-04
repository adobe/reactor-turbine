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
      ],
      externals: [
        // For extensions we expose a "require" function that extension developers can use to
        // require in utilities that we specifically expose. This require function is custom
        // and provided by DTM. It is intended to be interpreted by webpack, however webpack doesn't
        // know this and gets hung up on it because it can't find the module being required. It
        // would be great to just be able to tell webpack to ignore these particular references to
        // require but that's apparently not possible. Instead, this code makes it so that
        // each time webpack finds a require call that is:
        // 1. inside src/config
        // 2. outside any tests
        // 3. begins with an alpha character
        // it will create a mock module that just returns null instead of throwing an error
        // saying it can't find the referenced module on the file system.
        function(context, request, callback) {
          if (/^(?!.*__tests__$).*\/src\/config\/.*$/.test(context) &&
              /^[a-zA-Z]/.test(request)) {
            callback(null, 'var null');
          } else {
            callback();
          }
        }
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
