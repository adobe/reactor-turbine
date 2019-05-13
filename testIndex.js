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

// Engine tests
var testsContext = require.context('./src', true, /__tests__\/.*\.test\.jsx?$/);
testsContext.keys().forEach(testsContext);

// This is necessary for the coverage report to show all source files even when they're not
// included by tests. https://github.com/webpack-contrib/istanbul-instrumenter-loader/issues/15
var srcContext = require.context('./src', true, /^((?!__tests__).)*\.jsx?$/);
srcContext.keys().forEach(srcContext);

// Core module package tests
testsContext = require.context('./coreModulePackages', true, /^.\/[^\/]*\/test\.js/);
testsContext.keys().forEach(testsContext);

// This is necessary for the coverage report to show all source files even when they're not
// included by tests. https://github.com/webpack-contrib/istanbul-instrumenter-loader/issues/15
srcContext = require.context('./coreModulePackages', true, /^.\/[^\/]*\/index\.js/);
srcContext.keys().forEach(srcContext);
