/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * Patterns of source files (files within the src directory) that should be
 * ignored for test coverage checks and reporting.
 */
/* eslint-disable-next-line */
// ignore [hidden files, test files within the src folder, [...coreModules...] (some core modules don't have tests)]
module.exports = [
  '**/.*', // hidden folders
  '**/*.json',
  '**/*.test.js', // find src files to then find test files. ignore test files.
  '**/*empty.js',
  '**/coreModulePackages/document/index.js', // core module isn't tested
  '**/coreModulePackages/objectAssign/index.js', // core module isn't tested
  '**/coreModulePackages/promise/index.js', // core module isn't tested
  '**/coreModulePackages/window/index.js' // core module isn't tested
];
