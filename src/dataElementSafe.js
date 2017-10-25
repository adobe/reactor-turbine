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

var cookie = require('@adobe/reactor-cookie');

var COOKIE_PREFIX = '_sdsat_';

var storageDurations = {
  PAGEVIEW: 'pageview',
  SESSION: 'session',
  VISITOR: 'visitor'
};

var pageviewCache = {};

module.exports = {
  setValue: function(key, storageDuration, value) {
    switch (storageDuration) {
      case storageDurations.PAGEVIEW:
        pageviewCache[key] = value;
        break;
      case storageDurations.SESSION:
        cookie.set(COOKIE_PREFIX + key, value);
        break;
      case storageDurations.VISITOR:
        cookie.set(COOKIE_PREFIX + key, value, {
          expires: 730 // 2 years
        });
        break;
    }
  },
  getValue: function(key, storageDuration) {
    switch (storageDuration) {
      case storageDurations.PAGEVIEW:
        return pageviewCache[key];
      case storageDurations.SESSION:
      case storageDurations.VISITOR:
        return cookie.get(COOKIE_PREFIX + key);
    }
  }
};
