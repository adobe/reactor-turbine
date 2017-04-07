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

var CORE_MODULE_SCOPE = '@turbine/';

var modules = {
  'promise': require('./public/Promise'),
  'weak-map': require('./public/WeakMap'),
  'assign': require('./public/assign'),
  'client-info': require('./public/clientInfo'),
  'load-script': require('./public/loadScript'),
  'get-query-param': require('./public/getQueryParam'),
  'is-plain-object': require('./public/isPlainObject'),
  'get-data-element-value': require('./public/getDataElementValue'),
  'cookie': require('./public/cookie'),
  'debounce': require('./public/debounce'),
  'once': require('./public/once'),
  'write-html': require('./public/writeHtml'),
  'replace-tokens': require('./public/replaceTokens'),
  'on-page-bottom': require('./public/onPageBottom'),
  'window': require('window'),
  'document': require('document')
};

/**
 * Creates a function which can be passed as a "require" function to extension modules.
 *
 * @param {Object} buildInfo
 * @param {Object} propertySettings
 * @param {Function} getExtensionSettings
 * @param {Function} getSharedModuleExports
 * @param {Function} getModuleExportsByRelativePath
 * @returns {Function}
 */
module.exports = function(dynamicModules) {
  dynamicModules = dynamicModules || {};

  var allModules = Object.create(modules);
  allModules['logger'] = dynamicModules.logger;
  allModules['build-info'] = dynamicModules.buildInfo;
  allModules['property-settings'] = dynamicModules.propertySettings;
  allModules['get-extension-settings'] = dynamicModules.getExtensionSettings;
  allModules['get-shared-module'] = dynamicModules.getSharedModuleExports;
  allModules['get-hosted-lib-file-url'] = dynamicModules.getHostedLibFileUrl;

  return function(key) {
    if (key.indexOf(CORE_MODULE_SCOPE) === 0) {
      var coreModule = allModules[key.substr(CORE_MODULE_SCOPE.length)];
      if (coreModule) {
        return coreModule;
      }
    }

    if (key.indexOf('./') === 0 || key.indexOf('../') === 0) {
      return dynamicModules.getModuleExportsByRelativePath(key);
    }

    throw new Error('Cannot resolve module "' + key + '".');
  };
};
