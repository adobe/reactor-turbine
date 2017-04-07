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

var window = require('window');
var assign = window.Object.assign;

if (typeof assign === 'undefined') {
  assign = function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var from = arguments[i];
      if (from === null || from === undefined) {
        continue;
      }
      var keys = Object.keys(from);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        target[key] = from[key];
      }
    }
    return target;
  };
}

module.exports = assign;
