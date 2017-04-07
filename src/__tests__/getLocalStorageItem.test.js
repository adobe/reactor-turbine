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

describe('getLocalStorageItem', function() {
  it('returns a local storage item', function() {
    // Mocking window because Safari throws an error when setting a local storage item in Private
    // Browser Mode.
    var mockWindow = {
      localStorage: {
        setItem: function(key, value) {
          this[key] = value;
        },
        getItem: function(key) {
          return this[key];
        },
        removeItem: function(key) {
          this[key] = null;
        }
      }
    };

    var getLocalStorageItem = require('inject!../getLocalStorageItem')({
      window: mockWindow
    });

    mockWindow.localStorage.setItem('foo', 'something');
    expect(getLocalStorageItem('foo')).toEqual('something');

    mockWindow.localStorage.removeItem('foo');
    expect(getLocalStorageItem('foo')).toBeNull();
  });

  it('proper error handling if Local Storage is disabled', function() {
    var mockWindow = {
      localStorage: {
        getItem: function() {
          throw Error('Test error');
        }
      }
    };

    var getLocalStorageItem = require('inject!../getLocalStorageItem')({
      window: mockWindow
    });

    expect(getLocalStorageItem('foo')).toBeNull();
  });
});
