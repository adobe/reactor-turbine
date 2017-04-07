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

var isPlainObject = require('./isPlainObject');
var getVar = require('../getVar');
var isVar = require('../isVar');
var state = require('../state');
var undefinedVarsReturnEmpty = state.getPropertySettings().undefinedVarsReturnEmpty;

var replaceTokensInString;
var replaceTokensInObject;
var replaceTokensInArray;
var replaceTokens;

var getVarValue = function(token, variableName, element, event) {
  if (!isVar(variableName)) {
    return token;
  }

  var val = getVar(variableName, element, event);
  return val == null && undefinedVarsReturnEmpty ? '' : val;
};

/**
 * Perform variable substitutions to a string where tokens are specified in the form %foo%.
 * If the only content of the string is a single data element token, then the raw data element
 * value will be returned instead.
 *
 * @param str {string} The string potentially containing data element tokens.
 * @param element {HTMLElement} The element to use for tokens in the form of %this.property%.
 * @param event {Object} The event object to use for tokens in the form of %target.property%.
 * @returns {*}
 */
replaceTokensInString = function(str, element, event) {
  // Is the string a single data element token and nothing else?
  var result = /^%([^%]+)%$/.exec(str);

  if (result) {
    return getVarValue(str, result[1], element, event);
  } else {
    return str.replace(/%(.+?)%/g, function(token, variableName) {
      return getVarValue(token, variableName, element, event);
    });
  }
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

replaceTokens = function(thing, element, event) {
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
