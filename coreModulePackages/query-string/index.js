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
'use strict';

/**
 * Parse a query string into an object. Leading `?` or `#` are ignored, so you
 * can pass `location.search` or `location.hash` directly.
 *
 * URL components are decoded with decode-uri-component.
 *
 * Parse arrays with elements using duplicate keys, e.g. ?a=1&a=2 becomes
 * {a: ['1', '2']}.
 *
 * Query keys are sorted alphabetically.
 *
 * Numbers and booleans are NOT parsed; they are left as strings.
 * @param {string} query the query part of a url
 * @returns {{ [key: string]: string | string[] | undefined }} the parsed query string
 */
var parseQueryString = function (query) {
  /** @type {{[key: string]: string | string[] | undefined }} */
  var result = {};

  if (!query || typeof query !== 'string') {
    return result;
  }

  var cleanQuery = query.trim().replace(/^[?#&]/, '');
  var params = new URLSearchParams(cleanQuery);

  var iter = params.keys();
  do {
    var v = iter.next();
    var key = v.value;

    if (key) {
      var values = params.getAll(key);
      if (values.length === 1) {
        result[key] = values[0];
      } else {
        result[key] = values;
      }
    }
  } while (v.done === false);

  return result;
};

/**
 * Transform an object into a query string.
 *
 * Keys having object values are ignored.
 *
 * @param {object} the object to transform into a query string
 * @returns {string} the parsed query string
 */

var stringifyObject = function (object) {
  var spaceToken = '{{space}}';
  var params = new URLSearchParams();

  Object.keys(object).forEach(function (key) {
    var value = object[key];

    if (typeof object[key] === 'string') {
      value = value.replace(/ /g, spaceToken);
    } else if (
      ['object', 'undefined'].includes(typeof value) &&
      !Array.isArray(value)
    ) {
      value = '';
    }

    if (Array.isArray(value)) {
      value.forEach(function (arrayValue) {
        params.append(key, arrayValue);
      });
    } else {
      params.append(key, value);
    }
  });

  return params
    .toString()
    .replace(new RegExp(encodeURIComponent(spaceToken), 'g'), '%20');
};

// We proxy the underlying querystring module so we can limit the API we expose.
// This allows us to more easily make changes to the underlying implementation later without
// having to worry about breaking extensions. If extensions demand additional functionality, we
// can make adjustments as needed.
module.exports = {
  parse: function (string) {
    return parseQueryString(string);
  },
  stringify: function (object) {
    return stringifyObject(object);
  }
};
