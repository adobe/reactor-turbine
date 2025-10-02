/***************************************************************************************
 * (c) 2019 Adobe. All rights reserved.
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

// First, run integrity / sanity tests for production files that export an "injected" function
require('./src/__tests__/production-exports.integrity.test.js');

// Load unit tests from __tests__ directories, excluding integrity tests
var testsContext = require.context(
  './src',
  true,
  /__tests__\/(?!.*integrity\.test\.).*\.test\.jsx?$/
);

testsContext.keys().forEach(testsContext);

// Coverage for all non-test code in src (exclude __tests__ and __integration__)
var srcContext = require.context(
  './src',
  true,
  /^((?!(__tests__|__integration__)).)*\.jsx?$/
);
srcContext.keys().forEach(srcContext);

// Core module tests
testsContext = require.context(
  './coreModulePackages',
  true,
  /^.\/[^\/]*\/test\.js/
);
testsContext.keys().forEach(testsContext);

// Coverage for core module source
srcContext = require.context(
  './coreModulePackages',
  true,
  /^.\/[^\/]*\/index\.js/
);
srcContext.keys().forEach(srcContext);
