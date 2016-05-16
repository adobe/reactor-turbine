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
  it('returns null if the queryString is empty', function() {
    setSearch('');
    expect(getQueryParam('fly')).toBeNull();
  });

  it('returns null when null is passed as the parameter name', function() {
    setSearch('?fly=caddis');
    expect(getQueryParam(null)).toBeNull();
  });

  it('returns value for matching parameter - Case Sensitive', function() {
    setSearch('?fly=caddis');
    expect(getQueryParam('fly')).toEqual('caddis');
  });

  it('returns null when no matching parameter is found - Case Sensitive', function() {
    setSearch('?fly=caddis');
    expect(getQueryParam('Fly')).toBeNull();
  });

  it('returns value for matching parameter - Case Insensitive', function() {
    setSearch('?fly=caddis');
    expect(getQueryParam('Fly', true)).toEqual('caddis');
  });

  it('returns null when no matching parameter is found', function() {
    setSearch('?fly=caddis');
    expect(getQueryParam('nymph', true)).toBeNull();
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
