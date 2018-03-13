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

var injectGetNamespacedStorage = require('inject-loader!../getNamespacedStorage');

describe('getNamespacedStorage', function() {
  var createMockWindowUnavailableStorage = function() {
    return {
      get sessionStorage() {
        throw new Error('Storage unavailable.');
      },
      get localStorage() {
        throw new Error('Storage unavailable.');
      }
    };
  };

  afterEach(function() {
    window.localStorage.removeItem('com.adobe.reactor.foo');
  });

  ['sessionStorage', 'localStorage'].forEach(function(storageType) {
    describe('getItem', function() {
      it('returns item', function() {
        var getNamespacedStorage = injectGetNamespacedStorage();
        var storage = getNamespacedStorage(storageType);

        window[storageType].setItem('com.adobe.reactor.foo', 'something');
        expect(storage.getItem('foo')).toEqual('something');
      });

      it('proper error handling if storage is disabled', function() {
        var mockWindow = createMockWindowUnavailableStorage();

        var getNamespacedStorage = injectGetNamespacedStorage({
          '@adobe/reactor-window': mockWindow
        });

        var storage = getNamespacedStorage(storageType);

        expect(storage.getItem('foo')).toBeNull();
      });
    });

    describe('setItem', function() {
      it('sets item', function() {
        var getNamespacedStorage = injectGetNamespacedStorage();
        var storage = getNamespacedStorage(storageType);

        storage.setItem('foo', 'something');
        expect(window[storageType].getItem('com.adobe.reactor.foo')).toEqual('something');
      });

      it('proper error handling if storage is disabled', function() {
        var mockWindow = createMockWindowUnavailableStorage();

        var getNamespacedStorage = injectGetNamespacedStorage({
          '@adobe/reactor-window': mockWindow
        });

        var storage = getNamespacedStorage(storageType);

        storage.setItem('thing', 'something');

        expect(window.localStorage.getItem('thing')).toBeNull();
      });
    });
  });
});
