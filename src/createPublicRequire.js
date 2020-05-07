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

var CORE_MODULE_PREFIX = '@adobe/reactor-';

var modules = {
  cookie: require('@adobe/reactor-cookie'),
  document: require('@adobe/reactor-document'),
  'load-script': require('@adobe/reactor-load-script'),
  'object-assign': require('@adobe/reactor-object-assign'),
  promise: require('@adobe/reactor-promise'),
  'query-string': require('@adobe/reactor-query-string'),
  window: require('@adobe/reactor-window')
};

/**
 * Creates a function which can be passed as a "require" function to extension modules.
 *
 * @param {Function} getModuleExportsByRelativePath
 * @returns {Function}
 */
module.exports = function (getModuleExportsByRelativePath) {
  return function (key) {
    if (key.indexOf(CORE_MODULE_PREFIX) === 0) {
      var keyWithoutScope = key.substr(CORE_MODULE_PREFIX.length);
      var module = modules[keyWithoutScope];

      if (module) {
        return module;
      }
    }

    if (key.indexOf('./') === 0 || key.indexOf('../') === 0) {
      return getModuleExportsByRelativePath(key);
    }

    throw new Error('Cannot resolve module "' + key + '".');
  };
};
