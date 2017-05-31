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

var document = require('document');
var window = require('window');
var state = require('./state');
var getDataElementValue = require('./public/getDataElementValue');
var getUri = require('./public/getUri');
var getQueryParam = require('./public/getQueryParam');
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
var getObjectProperty = function(host, path, supportSpecial) {
  var propChain = path.split('.');
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
 * Returns the value of a variable, where the variable can be a data element, event, element, or
 * target in question.
 * @param {string} variable
 * @param {Object} [syntheticEvent] A synthetic event. Only required when using %event... %this...
 * or %target...
 * @returns {*}
 */
module.exports = function(variable, syntheticEvent) {
  var uri = getUri();
  var randMatch;
  var value;
  var map = {
    URI: uri,
    uri: uri,
    protocol: document.location.protocol,
    hostname: document.location.hostname
  };
  if (state.getDataElementDefinition(variable)) {
    return getDataElementValue(variable);
  }
  value = map[variable];
  if (value === undefined) {
    if (variable.substring(0, 5) === 'this.') {
      if (syntheticEvent) {
        variable = variable.slice(5);
        value = getObjectProperty(syntheticEvent.element, variable, true);
      }
    } else if (variable.substring(0, 6) === 'event.') {
      if (syntheticEvent) {
        variable = variable.slice(6);
        value = getObjectProperty(syntheticEvent, variable);
      }
    } else if (variable.substring(0, 7) === 'target.') {
      if (syntheticEvent) {
        variable = variable.slice(7);
        value = getObjectProperty(syntheticEvent.target, variable);
      }
    } else if (variable.substring(0, 7) === 'window.') {
      variable = variable.slice(7);
      value = getObjectProperty(window, variable);
    } else if (variable.substring(0, 6) === 'param.') {
      variable = variable.slice(6);
      value = getQueryParam(variable);
    } else {
      randMatch = variable.match(/^rand([0-9]+)$/);
      if (randMatch) {
        var len = Number(randMatch[1]);
        var s = (Math.random() * (Math.pow(10, len) - 1)).toFixed(0);
        value = Array(len - s.length + 1).join('0') + s;
      } else {
        value = getObjectProperty(state.customVars, variable);
      }
    }
  }
  return value;
};
