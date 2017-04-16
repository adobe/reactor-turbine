var path = require('path');
var argv = require('yargs')
  .array('browsers')
  .default('browsers', ['Firefox'])
  .default('singleRun', true)
  .default('coverage', true)
  .argv;

var reporters = ['dots'];
var rules = [];

if (argv.coverage) {
  rules.push({
    test: /\.js$/,
    include: new RegExp(path.basename(process.cwd()) + '\\' + path.sep + 'src'),
    exclude: new RegExp('(__tests__)\\' + path.sep),
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

    webpack: {
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
