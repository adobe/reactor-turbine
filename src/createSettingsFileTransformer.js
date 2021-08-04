/***************************************************************************************
 * (c) 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

var isPlainObject = require('is-plain-object');
var objectAssign = require('@adobe/reactor-object-assign');

function isArrayReference(str) {
  return (
    typeof str === 'string' &&
    str.indexOf('[') !== -1 &&
    str.indexOf(']') !== -1
  );
}
function sanitizeArrayKey(pathStrSegment) {
  return pathStrSegment.substr(
    0,
    // the name goes up to the start of the array bracket: 'someArrayName[]'
    pathStrSegment.indexOf('[')
  );
}

/**
 * Recursive function to loop through settings and look for the setting to transform,
 * which is the final entry within the pathSegments array. Alters settings in-place.
 * @param {Array} pathSegments
 * @param {Object} settings
 * @param {Function} decorateWithDynamicHost
 */
function traverseIntoSettings(pathSegments, settings, decorateWithDynamicHost) {
  // nothing to do
  if (!pathSegments.length || !isPlainObject(settings)) {
    return;
  }

  var currentKey = pathSegments[0];

  // base case
  if (pathSegments.length === 1) {
    if (
      settings.hasOwnProperty(currentKey) &&
      typeof settings[currentKey] === 'string'
    ) {
      settings[currentKey] = decorateWithDynamicHost(settings[currentKey]);
    }
    return;
  }

  // still more work to do
  var remainingPathSegments = pathSegments.slice(1);
  if (isArrayReference(currentKey)) {
    // 'someArrayReference[]' --> 'someArrayReference'
    currentKey = sanitizeArrayKey(currentKey);
    var settingsValue = settings[currentKey];
    if (Array.isArray(settingsValue)) {
      settingsValue.forEach(function (arrayEntryObject) {
        return traverseIntoSettings(
          remainingPathSegments,
          arrayEntryObject,
          decorateWithDynamicHost
        );
      });
    }
  } else {
    // object case
    return traverseIntoSettings(
      remainingPathSegments,
      settings[currentKey],
      decorateWithDynamicHost
    );
  }
}

/**
 * Returns a function that when called will attempt to traverse the passed in
 * settings object to each file path and transform a relative URL to an absolute
 * URL.
 *
 * @param isDynamicEnforced
 * @param decorateWithDynamicHost
 * @returns {(function(*=, *=, *=): (*))|*}
 */
module.exports = function (isDynamicEnforced, decorateWithDynamicHost) {
  return function (settings, filePaths, moduleReferencePath) {
    if (
      !isDynamicEnforced ||
      !isPlainObject(settings) ||
      !Object.keys(settings).length ||
      !Array.isArray(filePaths) ||
      !filePaths.length
    ) {
      return settings;
    }

    // if the settings are modified in place, they're no longer relative when we arrive here
    var settingsCopy = objectAssign({}, settings);

    // pull out the file paths by the module's reference path and loop over each urlPath
    filePaths.forEach(function (filePathString) {
      // The custom code action provides the ability to have the source code in the 'source'
      // variable or to have an external file. Therefore, this module has 2 behaviors.
      // It also does not provide a value of false for isExternal just as all other extensions
      // that use fileTransform do not provide an isExternal variable check. Therefore, we need
      // to treat Adobe's custom code action special, and don't augment the 'source' variable
      // if isExternal is not also present.
      var isAdobeCustomCodeAction = Boolean(
        moduleReferencePath != null &&
          /^core\/.*actions.*\/customCode\.js$/.test(moduleReferencePath)
      );
      if (
        isAdobeCustomCodeAction &&
        filePathString === 'source' &&
        !settingsCopy.isExternal
      ) {
        return;
      }

      // modify the object in place
      traverseIntoSettings(
        filePathString.split('.'),
        settingsCopy,
        decorateWithDynamicHost
      );
    });

    return settingsCopy;
  };
};
