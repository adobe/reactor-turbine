var isString = require('./isType/isString');
var isObject = require('./isType/isObject');
var isArray = require('./isType/isArray');
var replaceVarTokens = require('./dataElement/replaceVarTokens');

var preprocessObject;
var preprocessArray;

preprocessObject = function(obj, undefinedVarsReturnEmpty, elm, evt) {
  var ret = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var value = obj[key];
      if (isObject(value)) {
        ret[key] = preprocessObject(value, undefinedVarsReturnEmpty, elm, evt);
      } else if (isArray(value)) {
        ret[key] = preprocessArray(value, undefinedVarsReturnEmpty, elm, evt);
      } else {
        ret[key] = replaceVarTokens(value, undefinedVarsReturnEmpty, elm, evt);
      }
    }
  }
  return ret;
};

preprocessArray = function(arr, undefinedVarsReturnEmpty, elm, evt) {
  var ret = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    var value = arr[i];
    if (isString(value)) {
      value = replaceVarTokens(value, elm, evt);
    } else if (value && value.constructor === Object) { // TODO: Can we use isObject here?
      value = preprocessObject(value, undefinedVarsReturnEmpty, elm, evt);
    }
    ret.push(value);
  }
  return ret;
};

module.exports = function(settings, undefinedVarsReturnEmpty, elm, evt) {
  if (!settings) {
    return settings;
  }

  return preprocessObject(settings, undefinedVarsReturnEmpty, elm, evt);
};
