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

var cookie = require('js-cookie');

// js-cookie has other methods that we haven't exposed here. By limiting the exposed API,
// we have a little more flexibility to change the underlying implementation later. If clear
// use cases come up for needing the other methods js-cookie exposes, we can re-evaluate whether
// we want to expose them here.

// js-cookie 3.x removed auto-stringification of objects/arrays from set(). This logic is
// preserved from the 2.x source to maintain backward compatibility for extensions that pass
// objects or arrays to cookie.set() without manually stringifying.
// https://github.com/js-cookie/js-cookie/blob/v2.2.1/src/js.cookie.js
function set(name, value, attributes) {
  try {
    var result = JSON.stringify(value);
    if (/^[{[]/.test(result)) {
      value = result;
    }
  } catch (e) {
    console.error('error when testing string for setting cookie', e);
  }
  return cookie.set(name, value, attributes);
}

module.exports = {
  get: cookie.get,
  set: set,
  remove: cookie.remove
};
