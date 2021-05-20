function isArrayReference(str) {
  return isString(str) && str.indexOf('[') !== -1 && str.indexOf(']') !== -1;
}
function sanitizeArrayKeyAndSplit(key) {
  var parts = key.replace('[', '.').replace(']', '').split('.');
  var arrName = parts[0];
  var arrIndex = parts[1];
  return {
    arrName: arrName,
    arrIndex: arrIndex
  };
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
  var nextObject;

  if (isArrayReference(nextPathKey)) {
    var nextPathKeyParts = sanitizeArrayKeyAndSplit(nextPathKey);
    nextObject =
      settingsSlice[nextPathKeyParts.arrName][nextPathKeyParts.arrIndex];
  } else {
    // objects
    nextObject = settingsSlice[nextPathKey];
  }
  if (pathArray.length === 1) {
    return nextObject;
  }
  return traverseDelegateProperties(pathArray.slice(1), nextObject);
}

module.exports = function (pathString, extensionSettings) {
  if (!isString(pathString) || !isObject(extensionSettings)) {
    return undefined;
  }

  return traverseDelegateProperties(pathString.split('.'), extensionSettings);
};
