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

var DEPRECATED_CORE_MODULE_PREFIX = '@turbine/';
var CORE_MODULE_PREFIX = '@adobe/reactor-';

var modules = {
  'promise': require('@adobe/reactor-promise'),
  'weak-map': require('./public/WeakMap'),
  'object-assign': require('@adobe/reactor-object-assign'),
  'client-info': require('./public/clientInfo'),
  'load-script': require('@adobe/reactor-load-script'),
  'get-query-param': require('./public/getQueryParam'),
  'is-plain-object': require('./public/isPlainObject'),
  'get-data-element-value': require('./public/getDataElementValue'),
  'cookie': require('@adobe/reactor-cookie'),
  'debounce': require('./public/debounce'),
  'once': require('./public/once'),
  'write-html': require('./public/writeHtml'),
  'replace-tokens': require('./public/replaceTokens'),
  'on-page-bottom': require('./public/onPageBottom'),
  'window': require('@adobe/reactor-window'),
  'document': require('@adobe/reactor-document'),
  'query-string': require('@adobe/reactor-query-string')
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
module.exports = function(dynamicModules, extensionDisplayName) {
  dynamicModules = dynamicModules || {};

  var modulesMovedToFreeVariable = {};

  modulesMovedToFreeVariable['logger'] = {
    module: dynamicModules.logger,
    newApi: 'turbine.logger'
  };

  modulesMovedToFreeVariable['build-info'] = {
    module: dynamicModules.buildInfo,
    newApi: 'turbine.buildInfo'
  };

  modulesMovedToFreeVariable['property-settings'] = {
    module: dynamicModules.propertySettings,
    newApi: 'turbine.propertySettings'
  };

  modulesMovedToFreeVariable['get-extension-settings'] = {
    module: dynamicModules.getExtensionSettings,
    newApi: 'turbine.getExtensionSettings(\'extension-name\')'
  };

  modulesMovedToFreeVariable['get-shared-module'] = {
    module: dynamicModules.getSharedModuleExports,
    newApi: 'turbine.getSharedModule(\'extension-name\', \'shared-module-name\')'
  };

  modulesMovedToFreeVariable['get-hosted-lib-file-url'] = {
    module: dynamicModules.getHostedLibFileUrl,
    newApi: 'turbine.getHostedLibFileUrl(\'file.js\')'
  };

  modulesMovedToFreeVariable['replace-tokens'] = {
    module: modules['replace-tokens'],
    newApi: 'turbine.replaceTokens(thing)'
  };

  modulesMovedToFreeVariable['on-page-bottom'] = {
    module: modules['on-page-bottom'],
    newApi: 'turbine.onPageBottom(callback)'
  };

  modulesMovedToFreeVariable['get-data-element-value'] = {
    module: modules['get-data-element-value'],
    newApi: 'turbine.getDataElementValue(name)'
  };

  return function(key) {
    if (key.indexOf(CORE_MODULE_PREFIX) === 0) {
      var keyWithoutScope = key.substr(CORE_MODULE_PREFIX.length);

      switch (keyWithoutScope) {
        case 'cookie':
        case 'document':
        case 'load-script':
        case 'object-assign':
        case 'promise':
        case 'query-string':
        case 'window':
          return modules[keyWithoutScope];
      }

    } else if (key.indexOf(DEPRECATED_CORE_MODULE_PREFIX) === 0) {
      var genericInstruction = 'If you are the developer of the ' + extensionDisplayName +
        ' Launch extension, please update your extension as soon as possible.';

      var deprecatedKeyWithoutScope = key.substr(DEPRECATED_CORE_MODULE_PREFIX.length);

      var moduleMovedToFreeVariable = modulesMovedToFreeVariable[deprecatedKeyWithoutScope];
      if (moduleMovedToFreeVariable) {
        console.warn('Using require() to retrieve the core module ' + key + ' has been ' +
          'deprecated and will be removed soon. Please use the new API: ' +
          moduleMovedToFreeVariable.newApi + ' The turbine variable is automatically available ' +
          'for use inside extension code. ' + genericInstruction);
        return moduleMovedToFreeVariable.module;
      }

      switch (deprecatedKeyWithoutScope) {
        case 'get-query-param':
          console.warn(key + ' has been renamed to ' + CORE_MODULE_PREFIX + 'query-string and ' +
            'has a different API. ' + genericInstruction);
          return modules[deprecatedKeyWithoutScope];
        case 'assign':
          console.warn(key + ' has been renamed to ' + CORE_MODULE_PREFIX + 'object-assign. ' +
            genericInstruction);
          return modules['object-assign'];
        case 'promise':
        case 'cookie':
        case 'document':
        case 'load-script':
        case 'window':
          console.warn(key + ' has been renamed to ' +
            CORE_MODULE_PREFIX + deprecatedKeyWithoutScope + '. ' + genericInstruction);
          return modules[deprecatedKeyWithoutScope];
        case 'debounce':
        case 'is-plain-object':
        case 'once':
        case 'weak-map':
        case 'write-html':
        case 'client-info':
          console.warn('Support for ' + key + ' will be removed soon. ' + genericInstruction);
          return modules[deprecatedKeyWithoutScope];
      }
    }

    if (key.indexOf('./') === 0 || key.indexOf('../') === 0) {
      return dynamicModules.getModuleExportsByRelativePath(key);
    }

    throw new Error('Cannot resolve module "' + key + '".');
  };
};
