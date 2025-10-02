/***************************************************************************************
 * (c) 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

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
