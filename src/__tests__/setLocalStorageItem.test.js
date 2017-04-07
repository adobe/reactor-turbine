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

describe('setLocalStorageItem', function() {
  it('sets and returns item', function() {
    // Mocking window because Safari throws an error when setting a local storage item in Private
    // Browser Mode.
    var mockWindow = {
      localStorage: {
        setItem: function(key, value) {
          this[key] = value;
        },
        getItem: function(key) {
          return this[key];
        }
      }
    };

    var setLocalStorageItem = require('inject!../setLocalStorageItem')({
      window: mockWindow
    });

    setLocalStorageItem('foo', 'something');
    expect(mockWindow.localStorage.getItem('foo')).toEqual('something');
  });

  it('proper error handling if Local Storage is disabled', function() {
    var mockWindow = {
      localStorage: {
        setItem: function() {
          throw Error('Test error');
        }
      }
    };

    var setLocalStorageItem = require('inject!../setLocalStorageItem')({
      window: mockWindow
    });

    setLocalStorageItem('thing', 'something');

    expect(window.localStorage.getItem('thing')).toBeNull();
  });
});
