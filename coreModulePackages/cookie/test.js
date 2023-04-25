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

var cookie = require('./index');

describe('cookie', function () {
  it('exposes get, set, and remove', function () {
    expect(cookie.get).toEqual(jasmine.any(Function));
    expect(cookie.set).toEqual(jasmine.any(Function));
    expect(cookie.remove).toEqual(jasmine.any(Function));
    expect(cookie.createCookieJarWithConverter).toEqual(jasmine.any(Function));
    var cookieJarWithConverter = cookie.createCookieJarWithConverter({
      write: {}
    });
    expect(cookieJarWithConverter.get).toEqual(jasmine.any(Function));
    expect(cookieJarWithConverter.set).toEqual(jasmine.any(Function));
    expect(cookieJarWithConverter.remove).toEqual(jasmine.any(Function));
  });

  it('does not expose other methods supported by the underlying implementation', function () {
    expect(Object.keys(cookie).length).toBe(4);
  });
});
