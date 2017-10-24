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

describe('localStorage', function() {
  var createMockLocalStorage = function() {
    var storage = {};
    return {
      setItem: function(key, value) {
        storage[key] = value;
      },
      getItem: function(key) {
        return storage[key];
      },
      removeItem: function(key) {
        storage[key] = null;
      }
    };
  };

  var createMockUnavailableLocalStorage = function() {
    return {
      getItem: function() {
        throw Error('Test error');
      }
    };
  };

  describe('getItem', function() {
    it('returns item', function() {
      // Mocking window because Safari throws an error when setting a local storage item in Private
      // Browser Mode.
      var storage = {};
      var mockWindow = {
        localStorage: createMockLocalStorage()
      };

      var localStorage = require('inject-loader!../localStorage')({
        window: mockWindow
      });

      mockWindow.localStorage.setItem('foo', 'something');
      expect(localStorage.getItem('foo')).toEqual('something');

      mockWindow.localStorage.removeItem('foo');
      expect(localStorage.getItem('foo')).toBeNull();
    });

    it('proper error handling if Local Storage is disabled', function() {
      var mockWindow = {
        localStorage: createMockUnavailableLocalStorage()
      };

      var localStorage = require('inject-loader!../localStorage')({
        window: mockWindow
      });

      expect(localStorage.getItem('foo')).toBeNull();
    });
  });

  describe('setItem', function() {
    it('sets item', function() {
      // Mocking window because Safari throws an error when setting a local storage item in Private
      // Browser Mode.
      var storage = {};
      var mockWindow = {
        localStorage: createMockLocalStorage()
      };

      var localStorage = require('inject-loader!../localStorage')({
        window: mockWindow
      });

      localStorage.setItem('foo', 'something');
      expect(mockWindow.localStorage.getItem('foo')).toEqual('something');
    });

    it('proper error handling if Local Storage is disabled', function() {
      var mockWindow = {
        localStorage: createMockUnavailableLocalStorage()
      };

      var localStorage = require('inject-loader!../localStorage')({
        window: mockWindow
      });

      localStorage.setItem('thing', 'something');

      expect(window.localStorage.getItem('thing')).toBeNull();
    });
  });
});
