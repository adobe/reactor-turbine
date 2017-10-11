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
// 'use strict';
//
// describe('Promise', function() {
//   var clearRequireCache = function() {
//     // Make sure we start fresh for each test so we're not dealing
//     // with cached values from previous tests. This is important so
//     // that we properly determine what gets exported depending on global
//     // variables that exist when turbine is loaded on a website.
//     delete require.cache[require.resolve('../index')];
//     delete require.cache[require.resolve('promise-polyfill')];
//   };
//
//   beforeEach(clearRequireCache);
//
//   afterAll(clearRequireCache);
//
//   it('returns native promise if available', function() {
//     var originalPromise = window.Promise;
//     var mockPromise = {};
//     window.Promise = mockPromise;
//     var Promise = require('../index');
//
//     expect(Promise).toBe(mockPromise);
//
//     window.Promise = originalPromise;
//   });
//
//   it('returns ponyfill promise if native promise not available', function() {
//     var originalPromise = window.Promise;
//     window.Promise = undefined;
//     var Promise = require('../index');
//
//     expect(Promise).toEqual(jasmine.any(Function));
//     expect(Promise).not.toBe(originalPromise);
//     expect(window.Promise).toBeUndefined();
//
//     window.Promise = originalPromise;
//   });
// });
