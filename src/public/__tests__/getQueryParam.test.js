/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

'use strict';

var mockWindow = {
  location: {
    search: ''
  }
};

var getQueryParam = require('inject!../getQueryParam')({
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
