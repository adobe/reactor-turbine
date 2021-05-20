function isObject(value) {
  if (value == null) {
    return false;
  }

  return Boolean(
    typeof value === 'object' &&
      Object.prototype.toString.call(value) === '[object Object]'
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

function traverseDelegateProperties(pathArray, settings) {
  if (!Array.isArray(pathArray) || !pathArray.length) {
    return undefined;
  }

  var nextPathKey = pathArray[0];
  if (!settings.hasOwnProperty(nextPathKey)) {
    return undefined;
  }
  if (pathArray.length === 1) {
    return settings[nextPathKey];
  }
  return traverseDelegateProperties(pathArray.slice(1), settings[nextPathKey]);
}

module.exports = function (pathString, extensionSettings) {
  if (!isString(pathString) || !isObject(extensionSettings)) {
    return undefined;
  }

  return traverseDelegateProperties(pathString.split('.'), extensionSettings);
};
