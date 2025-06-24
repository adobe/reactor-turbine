'use strict';

const path = require('path');
const yargs = require('yargs');

const argv = yargs
  .array('browsers')
  .default('browsers', ['Chrome'])
  .default('singleRun', true)
  .default('coverage', true).argv;

const reporters = ['dots'];
let startConnect = false;
let buildId;

if (process.env.CI) {
  buildId = `CI #${process.env.GITHUB_RUN_NUMBER} (${process.env.GITHUB_RUN_ID})`;
  argv.browsers = ['SL_EDGE', 'SL_CHROME', 'SL_SAFARI'];
  reporters.push('saucelabs');
} else {
  startConnect = true;
}

if (process.env.SAUCE_USERNAME) {
  reporters.push('saucelabs');
}

var rules = [];

if (argv.coverage) {
  rules.push({
    test: /\.js$/,
    include: path.resolve('src'),
    exclude: new RegExp('__tests__'),
    loader: 'babel-loader'
  });
  rules.push({
    test: /index.js$/,
    include: path.resolve('coreModulePackages'),
    exclude: new RegExp('node_modules'),
    loader: 'babel-loader'
  });
  reporters.push('coverage');
}

module.exports = function (config) {
  config.set({
    autoWatch: true,
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000,
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: argv.browsers,
    captureTimeout: 180000,
    colors: true,
    // how many browser should be started simultaneous
    concurrency: Infinity,
    coverageReporter: {
      reporters: [
        { type: 'html' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
      ]
    },
    customLaunchers: {
      SL_CHROME: {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: 'latest'
      },
      SL_FIREFOX: {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: 'latest'
      },
      SL_SAFARI: {
        base: 'SauceLabs',
        browserName: 'safari',
        // https://support.saucelabs.com/hc/en-us/community/posts/360016821133-Tests-on-Safari-11-started-failing-between-2018-07-19-and-2018-07-20
        platform: 'macOS 11',
        version: 'latest'
      },
      SL_EDGE: {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        version: 'latest'
      },
      SL_IOS: {
        base: 'SauceLabs',
        deviceName: 'iPhone XS Simulator',
        appiumVersion: '1.9.1',
        browserName: 'Safari',
        platformName: 'iOS',
        platformVersion: '12.0'
      },
      SL_ANDROID: {
        base: 'SauceLabs',
        deviceName: 'Android GoogleAPI Emulator',
        appiumVersion: '1.9.1',
        browserName: 'Chrome',
        platformName: 'Android',
        platformVersion: '7.1'
      }
    },
    exclude: ['**/*.test.js'],
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
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'jasmine-matchers', 'webpack'],
    hostname: '0.0.0.0',
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN
    //    || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'testIndex.js': ['webpack']
    },
    // web server port
    port: 9876,
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: reporters,
    sauceLabs: {
      buildId: buildId,
      testName: 'reactor-turbine Unit Test',
      tunnelIdentifier: 'github-action-tunnel',
      startConnect: startConnect,
      retryLimit: 3,
      recordVideo: false,
      recordScreenshots: false,
      // https://support.saucelabs.com/hc/en-us/articles/115010079868-Issues-with-Safari-and-Karma-Test-Runner
      connectOptions: {
        noSslBumpDomains: 'all'
      }
    },
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: argv.singleRun,
    webpack: {
      mode: 'development',
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
      debug: false,
      progress: true,
      quiet: false
    }
  });
};
