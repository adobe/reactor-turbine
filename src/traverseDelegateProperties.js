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

function traverseDelegateProperties(pathArray, settingsSlice) {
  // A string of the form a.b[4].c.names[2] is split into
  // [a, b[4], c, names, [2]]
  if (!Array.isArray(pathArray) || !pathArray.length) {
    return undefined;
  }

  var nextPathKey = pathArray[0];
  var nextPropertyValue;

  if (isArrayReference(nextPathKey)) {
    var nextPathKeyParts = sanitizeArrayKey(nextPathKey);
    nextPropertyValue =
      settingsSlice[nextPathKeyParts.arrName][nextPathKeyParts.arrIndex];
  } else {
    // objects
    nextPropertyValue = settingsSlice[nextPathKey];
  }

  if (pathArray.length === 1) {
    return nextPropertyValue;
  }

  return traverseDelegateProperties(pathArray.slice(1), nextPropertyValue);
}

function pluckSettingsValue(pathString, settings) {
  if (!isString(pathString) || !isObject(settings)) {
    return undefined;
  }

  return traverseDelegateProperties(pathString.split('.'), settings);
}

// function pushValueIntoSettings(pathString, settings, value) {
//   if (!isString(pathString) || !isObject(settings)) {
//     return undefined;
//   }
//
//   var settingsCopy = objectAssign({}, settings);
//
//   var pathSegments = pathString.split('.');
//   var nextSettingsLevel = settingsCopy; // 2 references now point to "settingsCopy"
//
//   // Pull off because this is the ultimate variable that needs to be granted the passed in value
//   var finalSegment = pathSegments.pop();
//
//   // traverse down to the inner-most path
//   pathSegments.forEach(function (pathSegment, index) {
//     if (isArrayReference(pathSegment)) {
//       var nextPathKeyParts = sanitizeArrayKeyAndSplit(pathSegment);
//       nextSettingsLevel =
//         nextSettingsLevel[nextPathKeyParts.arrName][nextPathKeyParts.arrIndex];
//     } else {
//       nextSettingsLevel = nextSettingsLevel[pathSegment];
//     }
//   });
//
//   // update the value
//   if (isArrayReference(finalSegment)) {
//     var nextPathKeyParts = sanitizeArrayKeyAndSplit(finalSegment);
//     nextSettingsLevel[nextPathKeyParts.arrName][
//       nextPathKeyParts.arrIndex
//     ] = value;
//   } else {
//     nextSettingsLevel[finalSegment] = value;
//   }
//
//   return settingsCopy;
// }

function pushValueIntoSettings(
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
  if (settings.hasOwnProperty(settingToReplace)) {
    var url = settings[settingToReplace];
    settings[settingToReplace] = decorateWithDynamicHost(url);
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
          return pushValueIntoSettings(
            remainingPathString,
            arrayEntryObject,
            decorateWithDynamicHost
          );
        });
      }
    } else {
      pushValueIntoSettings(
        remainingPathString,
        settings[currentKey],
        decorateWithDynamicHost
      );
    }
  }
}

module.exports = {
  pluckSettingsValue: pluckSettingsValue,
  pushValueIntoSettings: function (
    filePathString,
    settings,
    decorateWithDynamicHost
  ) {
    if (!isString(filePathString) || !isObject(settings)) {
      return settings;
    }

    var settingsCopy = objectAssign({}, settings);
    try {
      pushValueIntoSettings(
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
    return settingsCopy;
  }
};
