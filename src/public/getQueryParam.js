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

/**
 * Retrieves a variable value from the current URL querystring.
 * @param name The name of the querystring parameter.
 * @param [caseInsensitive=false] Whether differences in parameter name casing should be ignored.
 * This does not change the value that is returned.
 * @returns {string}
 */
module.exports = function(name, caseInsensitive) {
  // We can't cache querystring values because they can be changed at any time with
  // the HTML5 History API.
  var match = new RegExp('[?&]' + name + '=([^&]*)', caseInsensitive ? 'i' : '')
    .exec(window.location.search);

  if (match) {
    return decodeURIComponent(match[1].replace(/\+/g, ' '));
  }
};
