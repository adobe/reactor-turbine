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

// When local storage is disabled on Safari, the mere act of referencing window.localStorage
// throws an error. For this reason, referencing window.localStorage without being inside
// a try-catch should be avoided.
module.exports = {
  /**
   * Saves a value to local storage.
   * @param {string} name The name of the item to be saved.
   * @param {string} value The value of the item to be saved.
   * @returns {boolean} Whether the item was successfully saved to local storage.
   */
  getItem: function(name) {
    try {
      return window.localStorage.getItem(name);
    } catch (e) {
      return null;
    }
  },
  /**
   * Reads a value from local storage.
   * @param {string} name The name of the item to be read.
   * @returns {string}
   */
  setItem: function(name, value) {
    try {
      window.localStorage.setItem(name, value);
      return true;
    } catch (e) {
      return false;
    }
  }
};
