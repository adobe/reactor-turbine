var isPlainObject = require('./public/isPlainObject');
var getVar = require('./public/getVar');
var state = require('./state');
var undefinedVarsReturnEmpty = state.getPropertySettings().undefinedVarsReturnEmpty;

var replaceTokensInString;
var replaceTokensInObject;
var replaceTokensInArray;
var replaceTokens;

/**
 * Perform variable substitutions to a string where tokens are specified in the form %foo%.
 * @param str {string} The string to which substitutions should be applied.
 * @param element {HTMLElement} The element to use for tokens in the form of %this.property%.
 * @param event {Object} The event object to use for tokens in the form of %target.property%.
 * @returns {string}
 */
replaceTokensInString = function(str, element, event) {
  return str
    .replace(/%(.*?)%/g, function(token, variableName) {
      var val = getVar(variableName, element, event);
      if (val == null) {
        return undefinedVarsReturnEmpty ? '' : token;
      } else {
        return val;
      }
    });
};

replaceTokensInObject = function(obj, element, event) {
  var ret = {};
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = obj[key];
    ret[key] = replaceTokens(value, element, event);
  }
  return ret;
};

replaceTokensInArray = function(arr, element, event) {
  var ret = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    ret.push(replaceTokens(arr[i], element, event));
  }
  return ret;
};

var replaceTokens = function(thing, element, event) {
  if (typeof thing === 'string') {
    return replaceTokensInString(thing, element, event);
  } else if (Array.isArray(thing)) {
    return replaceTokensInArray(thing, element, event);
  } else if (isPlainObject(thing)) {
    return replaceTokensInObject(thing, element, event);
  }

  return thing;
};

/**
 * Replacing any variable tokens (%myDataElement%, %this.foo%, etc.) with their associated values.
 * A new string, object, or array will be created; the thing being processed will never be
 * modified.
 * @param {*} thing Thing potentially containing variable tokens. Objects and arrays will be
 * deeply processed.
 * @param {HTMLElement} [element] Associated HTML element. Used for special tokens
 * (%this.something%).
 * @param {Object} [event] Associated event. Used for special tokens (%event.something%,
 * %target.something%)
 * @returns {*} A processed value.
 */
module.exports = replaceTokens;
