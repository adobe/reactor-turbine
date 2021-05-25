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

var objectAssign = require('@adobe/reactor-object-assign');
var extractModuleExports = require('./extractModuleExports');
var logger = require('./logger');

module.exports = function (
  traverseDelegateProperties,
  isDynamicEnforced,
  decorateWithDynamicHost
) {
  var moduleByReferencePath = {};

  var getModule = function (referencePath) {
    var module = moduleByReferencePath[referencePath];

    if (!module) {
      throw new Error('Module ' + referencePath + ' not found.');
    }

    return module;
  };

  var registerModule = function (
    referencePath,
    moduleDefinition,
    extensionName,
    require,
    turbine
  ) {
    var module = {
      definition: moduleDefinition,
      extensionName: extensionName,
      require: require,
      turbine: turbine
    };
    module.require = require;
    moduleByReferencePath[referencePath] = module;
  };

  var hydrateCache = function () {
    Object.keys(moduleByReferencePath).forEach(function (referencePath) {
      try {
        getModuleExports(referencePath);
      } catch (e) {
        var errorMessage =
          'Error initializing module ' +
          referencePath +
          '. ' +
          e.message +
          (e.stack ? '\n' + e.stack : '');
        logger.error(errorMessage);
      }
    });
  };

  var getModuleExports = function (referencePath) {
    var module = getModule(referencePath);

    // Using hasOwnProperty instead of a falsey check because the module could export undefined
    // in which case we don't want to execute the module each time the exports is requested.
    if (!module.hasOwnProperty('exports')) {
      module.exports = extractModuleExports(
        module.definition.script,
        module.require,
        module.turbine
      );
    }

    return module.exports;
  };

  /*
   * Stored by reference path, holds the modules settings that need to be transformed
   * into a dynamic URL.
   * {
   *  'referencePath': {
   *     'setting.nested[4].path': 'relative-url'
   *   }
   * }
   */
  var fileTransformsCacheByReferencePath = {};
  var decorateSettingsWithDelegateFilePaths = function (
    referencePath,
    settings
  ) {
    // nothing to do
    if (!isDynamicEnforced || !Object.keys(settings).length) {
      return settings;
    }

    var settingsCopy = objectAssign({}, settings);

    // store into the cache an object that is referenced by referencePath
    if (!fileTransformsCacheByReferencePath.hasOwnProperty(referencePath)) {
      fileTransformsCacheByReferencePath[referencePath] = {};
    }
    // pull the cache object
    var cache = fileTransformsCacheByReferencePath[referencePath];

    // see if the module has file paths
    var module = getModule(referencePath);

    if (module.hasOwnProperty('filePaths') && Array.isArray(module.filePaths)) {
      // pull out the file paths by the module's reference path and loop over each urlPath
      module.filePaths.forEach(function (urlSettingPath) {
        if (!cache.hasOwnProperty(urlSettingPath)) {
          // accumulate the settings over time that need to be URL transformed
          var url = traverseDelegateProperties.pluckSettingsValue(
            urlSettingPath,
            settingsCopy
          );
          if (url) {
            url = decorateWithDynamicHost(url);
          }
          cache[urlSettingPath] = url;
        }
      });
    }

    Object.keys(cache).forEach(function (urlSettingPath) {
      var decoratedUrlValue = cache[urlSettingPath];
      traverseDelegateProperties.pushValueIntoSettings(
        urlSettingPath,
        settingsCopy,
        decoratedUrlValue
      );
    });

    // return the decorated settings object
    return settingsCopy;
  };

  var getModuleDefinition = function (referencePath) {
    return getModule(referencePath).definition;
  };

  var getModuleExtensionName = function (referencePath) {
    return getModule(referencePath).extensionName;
  };

  return {
    registerModule: registerModule,
    hydrateCache: hydrateCache,
    getModuleExports: getModuleExports,
    getModuleDefinition: getModuleDefinition,
    getModuleExtensionName: getModuleExtensionName,
    decorateSettingsWithDelegateFilePaths: decorateSettingsWithDelegateFilePaths
  };
};
