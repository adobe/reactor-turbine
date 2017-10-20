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

var state = require('./state');
var getDataElementValue = require('./getDataElementValue');
var cleanText = require('./cleanText');

var specialPropertyAccessors = {
  text: function(obj) {
    return obj.textContent;
  },
  cleanText: function(obj) {
    return cleanText(obj.textContent);
  }
};

/**
 * This returns the value of a property at a given path. For example, a <code>path<code> of
 * <code>foo.bar</code> will return the value of <code>obj.foo.bar</code>.
 *
 * In addition, if <code>path</code> is <code>foo.bar.getAttribute(unicorn)</code> and
 * <code>obj.foo.bar</code> has a method named <code>getAttribute</code>, the method will be
 * called with a value of <code>"unicorn"</code> and the value will be returned.
 *
 * Also, if <code>path</code> is <code>foo.bar.@text</code> or other supported properties
 * beginning with <code>@</code>, a special accessor will be used.
 *
 * @param host
 * @param path
 * @param supportSpecial
 * @returns {*}
 */
var getObjectProperty = function(host, propChain, supportSpecial) {
  var value = host;
  var attrMatch;
  for (var i = 0, len = propChain.length; i < len; i++) {
    if (value == null) {
      return undefined;
    }
    var prop = propChain[i];
    if (supportSpecial && prop.charAt(0) === '@') {
      var specialProp = prop.slice(1);
      value = specialPropertyAccessors[specialProp](value);
      continue;
    }
    if (value.getAttribute &&
      (attrMatch = prop.match(/^getAttribute\((.+)\)$/))) {
      var attr = attrMatch[1];
      value = value.getAttribute(attr);
      continue;
    }
    value = value[prop];
  }
  return value;
};

/**
 * Returns the value of a variable.
 * @param {string} variable
 * @param {Object} [syntheticEvent] A synthetic event. Only required when using %event... %this...
 * or %target...
 * @returns {*}
 */
module.exports = function(variable, syntheticEvent) {
  var value;

  if (state.getDataElementDefinition(variable)) {
    // Accessing nested properties of a data element using dot-notation is unsupported because users
    // can currently create data elements with periods in the name.
    value = getDataElementValue(variable);
  } else {
    var propChain = variable.split('.');
    var variableHostName = propChain.shift();

    if (variableHostName === 'this') {
      if (syntheticEvent) {
        // I don't know why this is the only one that supports special properties, but that's the
        // way it was in Satellite.
        value = getObjectProperty(syntheticEvent.element, propChain, true);
      }
    } else if (variableHostName === 'event') {
      if (syntheticEvent) {
        value = getObjectProperty(syntheticEvent, propChain);
      }
    } else if (variableHostName === 'target') {
      if (syntheticEvent) {
        value = getObjectProperty(syntheticEvent.target, propChain);
      }
    } else {
      value = getObjectProperty(state.customVars[variableHostName], propChain);
    }
  }

  return value;
};
