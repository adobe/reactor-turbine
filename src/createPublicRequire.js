/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

var validateInjectedParams = require('./helpers/validate-expected-inject-params');

function injectCreatePublicRequire({ moduleMap }) {
  moduleMap = moduleMap || {};
  return function createPublicRequire(getModuleExportsByRelativePath) {
    // I thought about allowing this prefix to be overridden for testing but
    // I think it's safer if we don't allow it to be tampered with.
    var CORE_MODULE_PREFIX = '@adobe/reactor-';
    return function publicRequire(key) {
      if (key.indexOf(CORE_MODULE_PREFIX) === 0) {
        var keyWithoutScope = key.substr(CORE_MODULE_PREFIX.length);
        if (moduleMap.hasOwnProperty(keyWithoutScope)) {
          return moduleMap[keyWithoutScope];
        }
      }

      if (key.indexOf('./') === 0 || key.indexOf('../') === 0) {
        return getModuleExportsByRelativePath(key);
      }

      throw new Error('Cannot resolve module "' + key + '".');
    };
  };
}

const validateInjection = validateInjectedParams(injectCreatePublicRequire);

// 'promise' in this context should be lowercase because imports are of the shape:
// @adobe/reactor-promise, etc.
module.exports = validateInjection({
  moduleMap: {
    cookie: require('@adobe/reactor-cookie'),
    document: require('@adobe/reactor-document'),
    'load-script': require('@adobe/reactor-load-script'),
    'object-assign': require('@adobe/reactor-object-assign'),
    promise: require('@adobe/reactor-promise'),
    'query-string': require('@adobe/reactor-query-string'),
    window: require('@adobe/reactor-window')
  }
});

if (REACTOR_KARMA_CI_UNIT_TEST_MODE) {
  /* START.TESTS_ONLY */
  module.exports.injectCreatePublicRequire = validateInjection;
  /* END.TESTS_ONLY */
}
