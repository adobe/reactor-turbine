var isPlainObject = require('./isType/isPlainObject');
var replaceVarTokens = require('./dataElement/replaceVarTokens');

var replaceTokensInObject;
var replaceTokensInArray;

replaceTokensInObject = function(obj, element, event) {
  var ret = {};
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = obj[key];
    if (isPlainObject(value)) {
      ret[key] = replaceTokensInObject(value, element, event);
    } else if (Array.isArray(value)) {
      ret[key] = replaceTokensInArray(value, element, event);
    } else {
      ret[key] = replaceVarTokens(value, element, event);
    }
  }
  return ret;
};

replaceTokensInArray = function(arr, element, event) {
  var ret = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    var value = arr[i];
    if (typeof value === 'string') {
      value = replaceVarTokens(value, element, event);
    } else if (Array.isArray(value)) {
      value = replaceTokensInArray(value, element, event);
    } else if (isPlainObject(value)) {
      value = replaceTokensInObject(value, element, event);
    }
    ret.push(value);
  }
  return ret;
};

/**
 * Preprocesses a configuration object by deeply inspecting the object and replacing any data
 * element tokens (%myDataElement%) which their associated data element values. This could
 * potentially preprocess other information in the future.
 * @param {Object} config Configuration object.
 * @param {HTMLElement} [element] Associated HTML element. Used for special tokens
 * (%this.something%).
 * @param {Object} [event] Associated event. Used for special tokens (%event.something%,
 * %target.something%)
 * @returns {Object} A new, preprocessed object.
 */
var replaceDataElementTokens = function(config, element, event) {
  if (!config) {
    return;
  }

  return replaceTokensInObject(config, element, event);
};

module.exports = replaceDataElementTokens;
