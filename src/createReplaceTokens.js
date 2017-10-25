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
module.exports = function(isVar, getVar, undefinedVarsReturnEmpty) {
  var replaceTokensInString;
  var replaceTokensInObject;
  var replaceTokensInArray;
  var replaceTokens;

  var getVarValue = function(token, variableName, syntheticEvent) {
    if (!isVar(variableName)) {
      return token;
    }

    var val = getVar(variableName, syntheticEvent);
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
  replaceTokensInString = function(str, syntheticEvent) {
    // Is the string a single data element token and nothing else?
    var result = /^%([^%]+)%$/.exec(str);

    if (result) {
      return getVarValue(str, result[1], syntheticEvent);
    } else {
      return str.replace(/%(.+?)%/g, function(token, variableName) {
        return getVarValue(token, variableName, syntheticEvent);
      });
    }
  };

  replaceTokensInObject = function(obj, syntheticEvent) {
    var ret = {};
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = obj[key];
      ret[key] = replaceTokens(value, syntheticEvent);
    }
    return ret;
  };

  replaceTokensInArray = function(arr, syntheticEvent) {
    var ret = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      ret.push(replaceTokens(arr[i], syntheticEvent));
    }
    return ret;
  };

  replaceTokens = function(thing, syntheticEvent) {
    if (typeof thing === 'string') {
      return replaceTokensInString(thing, syntheticEvent);
    } else if (Array.isArray(thing)) {
      return replaceTokensInArray(thing, syntheticEvent);
    } else if (typeof thing === 'object' && thing !== null) {
      return replaceTokensInObject(thing, syntheticEvent);
    }

    return thing;
  };

  return replaceTokens;
};
