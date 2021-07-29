var objectAssign = require('@adobe/reactor-object-assign');

function isArrayReference(str) {
  return isString(str) && str.indexOf('[') !== -1 && str.indexOf(']') !== -1;
}
function sanitizeArrayKey(pathStrSegment) {
  return pathStrSegment.substr(
    0,
    // the name goes up to the start of the array bracket: 'someArrayName[]'
    pathStrSegment.indexOf('[')
  );
}

function isObject(value) {
  if (value == null) {
    return false;
  }

  return Boolean(
    typeof value === 'object' &&
      Object.prototype.toString.call(value) === '[object Object]' &&
      !Array.isArray(value)
  );
}

function isString(value) {
  var type = typeof value;
  return Boolean(
    type === 'string' ||
      (type === 'object' &&
        value != null &&
        !Array.isArray(value) &&
        Object.prototype.toString.call(value) === '[object String]')
  );
}

function traverseIntoSettings(
  filePathString,
  settings,
  decorateWithDynamicHost
) {
  // nothing to do
  if (
    !isString(filePathString) ||
    !filePathString.length ||
    !isObject(settings)
  ) {
    return;
  }

  // get the next key to observe
  var pathSegments = filePathString.split('.');
  var settingToReplace = pathSegments.pop();
  if (!settingToReplace) {
    var error = new Error();
    error.code = 'malformed-path-string';
    throw error;
  }

  // base case
  if (
    settings.hasOwnProperty(settingToReplace) &&
    !pathSegments.length &&
    isString(settings[settingToReplace])
  ) {
    settings[settingToReplace] = decorateWithDynamicHost(
      settings[settingToReplace]
    );
    return;
  }

  // still more work to do
  if (pathSegments.length) {
    var currentKey = pathSegments.shift();
    // the next layer down will need the setting to replace back on the end
    var remainingPathString = pathSegments.concat(settingToReplace).join('.');

    if (isArrayReference(currentKey)) {
      // 'someArrayReference[]' --> 'someArrayReference'
      currentKey = sanitizeArrayKey(currentKey);
      var settingsValue = settings[currentKey];
      if (Array.isArray(settingsValue)) {
        settingsValue.forEach(function (arrayEntryObject) {
          return traverseIntoSettings(
            remainingPathString,
            arrayEntryObject,
            decorateWithDynamicHost
          );
        });
      }
    } else {
      return traverseIntoSettings(
        remainingPathString,
        settings[currentKey],
        decorateWithDynamicHost
      );
    }
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
      !isObject(settings) ||
      !Object.keys(settings).length ||
      !Array.isArray(filePaths) ||
      !filePaths.length
    ) {
      return settings;
    }

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

      try {
        // modify the object in place
        traverseIntoSettings(
          filePathString,
          settingsCopy,
          decorateWithDynamicHost
        );
      } catch (e) {
        if (e.code === 'malformed-path-string') {
          throw new Error(
            'The following pathString was malformed: ' + filePathString
          );
        }
      }
    });

    return settingsCopy;
  };
};
