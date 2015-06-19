var isString = require('./isType/isString');
var isObject = require('./isType/isObject');
var isArray = require('./isType/isArray');
var replaceVarTokens = require('./dataElement/replaceVarTokens');

function preprocessObject(obj, elm, evt) {
  var ret = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var value = obj[key];
      if (isObject(value)) {
        ret[key] = preprocessObject(value);
      } else if (isArray(value)) {
        ret[key] = preprocessArray(value);
      } else {
        ret[key] = replaceVarTokens(value, elm, evt);
      }
    }
  }
  return ret;
}

function preprocessArray(arr, elm, evt) {
  var ret = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    var value = arr[i];
    if (isString(value)) {
      value = replaceVarTokens(value, elm, evt);
    } else if (value && value.constructor === Object) { // TODO: Can we use isObject here?
      value = preprocessObject(value, elm, evt);
    }
    ret.push(value);
  }
  return ret;
}

module.exports = function (settings, elm, evt, forceLowerCase) {
  if (!settings) {
    return settings;
  }

  return preprocessObject(settings, elm, evt, forceLowerCase);
};
