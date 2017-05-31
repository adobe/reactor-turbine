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

var extractModuleExports = require('./extractModuleExports');
var logger = require('./logger');

var moduleByReferencePath = {};

var getModule = function(referencePath) {
  var module = moduleByReferencePath[referencePath];

  if (!module) {
    throw new Error('Module ' + referencePath + ' not found.');
  }

  return module;
};

var registerModule = function(referencePath, moduleDefinition, extensionName, require) {
  var module = {
    definition: moduleDefinition,
    require: require,
    extensionName: extensionName
  };
  module.require = require;
  moduleByReferencePath[referencePath] = module;
};

var hydrateCache = function() {
  Object.keys(moduleByReferencePath).forEach(function(referencePath) {
    try {
      getModuleExports(referencePath);
    } catch (e) {
      var errorMessage = 'Error initializing module ' + referencePath + '. ' +
        e.message + (e.stack ? '\n' + e.stack : '');
      logger.error(errorMessage);
    }
  });
};

var getModuleExports = function(referencePath) {
  var module = getModule(referencePath);

  // Using hasOwnProperty instead of a falsey check because the module could export undefined
  // in which case we don't want to execute the module each time the exports is requested.
  if (!module.hasOwnProperty('exports')) {
    module.exports = extractModuleExports(module.definition.script, module.require);
  }

  return module.exports;
};

var getModuleDefinition = function(referencePath) {
  return getModule(referencePath).definition;
};

var getModuleExtensionName = function(referencePath) {
  return getModule(referencePath).extensionName;
};

module.exports = {
  registerModule: registerModule,
  hydrateCache: hydrateCache,
  getModuleExports: getModuleExports,
  getModuleDefinition: getModuleDefinition,
  getModuleExtensionName: getModuleExtensionName
};


