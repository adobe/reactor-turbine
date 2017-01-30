/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

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

// getVar(variable, elm, evt)
// ==========================
//
// Return the value of a variable, where the variable
// can be a data element, defined in the "data" section
// of the initial config, or reference properties on
// an element, event, or target of the event in question,
// a query parameter, or a random number.
//
// - `variable` - the name of the variable to get
// - `[element]` - the associated element, if any
// - `[event]` - the associated event, if any
module.exports = function(variable, element, event) {
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
      if (element) {
        variable = variable.slice(5);
        value = getObjectProperty(element, variable, true);
      }
    } else if (variable.substring(0, 6) === 'event.') {
      if (event) {
        variable = variable.slice(6);
        value = getObjectProperty(event, variable);
      }
    } else if (variable.substring(0, 7) === 'target.') {
      if (event.target) {
        variable = variable.slice(7);
        value = getObjectProperty(event.target, variable);
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
