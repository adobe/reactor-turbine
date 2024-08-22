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

var getNamespacedStorage = require('./getNamespacedStorage');

var DATA_ELEMENTS_NAMESPACE = 'dataElements.';

var dataElementSessionStorage = getNamespacedStorage(
  'sessionStorage',
  DATA_ELEMENTS_NAMESPACE
);
var dataElementLocalStorage = getNamespacedStorage(
  'localStorage',
  DATA_ELEMENTS_NAMESPACE
);

var storageDurations = {
  PAGEVIEW: 'pageview',
  SESSION: 'session',
  VISITOR: 'visitor'
};

var pageviewCache = {};

var serialize = function (value) {
  var serialized;

  try {
    // On some browsers, with some objects, errors will be thrown during serialization. For example,
    // in Chrome with the window object, it will throw "TypeError: Converting circular structure
    // to JSON"
    serialized = JSON.stringify(value);
    // eslint-disable-next-line no-empty, no-unused-vars
  } catch (e) {}

  return serialized;
};

var setValue = function (key, storageDuration, value) {
  var serializedValue;

  switch (storageDuration) {
    case storageDurations.PAGEVIEW:
      pageviewCache[key] = value;
      return;
    case storageDurations.SESSION:
      serializedValue = serialize(value);
      if (serializedValue) {
        dataElementSessionStorage.setItem(key, serializedValue);
      }
      return;
    case storageDurations.VISITOR:
      serializedValue = serialize(value);
      if (serializedValue) {
        dataElementLocalStorage.setItem(key, serializedValue);
      }
      return;
  }
};

var getValue = function (key, storageDuration) {
  var value;

  // It should consistently return the same value if no stored item was found. We chose null,
  // though undefined could be a reasonable value as well.
  switch (storageDuration) {
    case storageDurations.PAGEVIEW:
      return pageviewCache.hasOwnProperty(key) ? pageviewCache[key] : null;
    case storageDurations.SESSION:
      value = dataElementSessionStorage.getItem(key);
      return value === null ? value : JSON.parse(value);
    case storageDurations.VISITOR:
      value = dataElementLocalStorage.getItem(key);
      return value === null ? value : JSON.parse(value);
  }
};

module.exports = {
  setValue: setValue,
  getValue: getValue
};
