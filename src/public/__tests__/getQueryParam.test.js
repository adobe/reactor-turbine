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

var mockWindow = {
  location: {
    search: ''
  }
};

var getQueryParam = require('inject-loader!../getQueryParam')({
  window: mockWindow
});

var setSearch = function(search) {
  mockWindow.location.search = search;
};

describe('getQueryParam', function() {
  it('returns undefined if the queryString is empty', function() {
    setSearch('');
    expect(getQueryParam('fly')).toBeUndefined();
  });

  it('returns undefined when null is passed as the parameter name', function() {
    setSearch('?fly=caddis');
    expect(getQueryParam(null)).toBeUndefined();
  });

  it('returns value for matching parameter - Case Sensitive', function() {
    setSearch('?fly=caddis');
    expect(getQueryParam('fly')).toEqual('caddis');
  });

  it('returns undefined when no matching parameter is found - Case Sensitive', function() {
    setSearch('?fly=caddis');
    expect(getQueryParam('Fly')).toBeUndefined();
  });

  it('returns value for matching parameter - Case Insensitive', function() {
    setSearch('?fly=caddis');
    expect(getQueryParam('Fly', true)).toEqual('caddis');
  });

  it('returns undefined when no matching parameter is found', function() {
    setSearch('?fly=caddis');
    expect(getQueryParam('nymph', true)).toBeUndefined();
  });

  it('returns a value for specific parameter when multiple ' +
      'parameters exist in the queryString', function() {
    setSearch('?fly=caddis&nymph=RS2');
    expect(getQueryParam('nymph', true)).toEqual('RS2');
  });

  it('returns a decoded value', function() {
    setSearch('?fly=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B');
    expect(getQueryParam('fly')).toEqual('шеллы');
  });

  it('replaces plus signs with spaces', function() {
    setSearch('?fly=caddis+fly');
    expect(getQueryParam('fly')).toEqual('caddis fly');
  });
});
