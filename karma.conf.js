var path = require('path');

var defaultBrowsers = ['Chrome'];
var reporters = ['dots'];
var startConnect = false;

if (process.env.TRAVIS) {
  var buildId =
    'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
  defaultBrowsers = [
    'SL_IE10',
    'SL_IE11',
    'SL_EDGE',
    'SL_CHROME',
    'SL_FIREFOX',
    'SL_SAFARI',
    'SL_ANDROID'
  ];
  reporters.push('saucelabs');
} else {
  startConnect = true;
}

if (process.env.SAUCE_USERNAME) {
  reporters.push('saucelabs');
}

var argv = require('yargs')
  .array('browsers')
  .default('browsers', defaultBrowsers)
  .default('singleRun', true)
  .default('coverage', true)
  .argv;

var rules = [];

if (argv.coverage) {
  rules.push({
    test: /\.js$/,
    include: path.resolve('src'),
    exclude: new RegExp('__tests__'),
    loader: 'istanbul-instrumenter-loader'
  });
  rules.push({
    test: /index.js$/,
    include: path.resolve('coreModulePackages'),
    exclude: new RegExp('node_modules'),
    loader: 'istanbul-instrumenter-loader'
  });
  reporters.push('coverage');
}

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'jasmine-matchers'],


    // list of files / patterns to load in the browser
    files: [
      {
        pattern: 'testIndex.js',
        watched: false,
        included: true,
        served: true
      },
      // Used in load-script core module test.
      {
        pattern: 'coreModulePackages/loadScript/empty.js',
        watched: false,
        included: false,
        served: true
      }
    ],


    // list of files to exclude
    exclude: [
      '**/*.test.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'testIndex.js': ['webpack']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: reporters,


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: argv.browsers,

    customLaunchers: {
      'SL_CHROME': {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: 'latest'
      },
      'SL_FIREFOX': {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: 'latest'
      },
      'SL_SAFARI': {
        base: 'SauceLabs',
        browserName: 'safari',
        version: 'latest'
      },
      'SL_IE10': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        version: '10'
      },
      'SL_IE11': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        version: '11'
      },
      'SL_EDGE': {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        version: 'latest'
      },
      'SL_IOS': {
        base: 'SauceLabs',
        deviceName: 'iPhone 8 Simulator',
        appiumVersion: '1.7.1',
        browserName: 'Safari',
        platformName: 'iOS',
        platformVersion: '11.0'
      },
      'SL_ANDROID': {
        base: 'SauceLabs',
        deviceName: 'Android GoogleAPI Emulator',
        appiumVersion: '1.7.1',
        browserName: 'Chrome',
        platformName: 'Android',
        platformVersion: '7.1'
      }
    },

    sauceLabs: {
      buildId: buildId,
      testName: 'reactor-turbine Unit Test',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      startConnect: startConnect,
      retryLimit: 3,
      recordVideo: false,
      recordScreenshots: false
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: argv.singleRun,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    coverageReporter: {
      reporters: [
        { type: 'html' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.dat' }
      ]
    },

    captureTimeout: 180000,
    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000,

    webpack: {
      mode: 'production',
      externals: {
        window: 'window',
        document: 'document'
      },
      resolve: {
        extensions: ['.js']
      },
      module: {
        rules: rules
      }
    },

    webpackServer: {
      stats: true,
      debug: false,
      progress: true,
      quiet: false
    }
  })
};
