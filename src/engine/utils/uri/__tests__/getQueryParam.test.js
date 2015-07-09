'use strict';

var rewire = require('rewire');
var getQueryParam = rewire('../getQueryParam');
var setSearch;
var revert;

describe('getQueryParam', function() {

  beforeEach(function() {
    setSearch = function(search) {
      revert = getQueryParam.__set__({
        window: {
          location: {
            search: search
          }
        }
      });
    };
  });

  afterEach(function() {
    revert();
  });

  it('returns undefined if the queryString is empty', function() {
    setSearch('');
    expect(getQueryParam()).toBeUndefined();
  });

  it('returns undefined if the queryString is not a string', function() {
    setSearch({a: 'apple'});
    expect(getQueryParam()).toBeUndefined();
  });

  it('returns a value for a key in the queryString - Case Sensitive', function() {
    setSearch('?fly=caddis');
    expect(getQueryParam('fly', false)).toEqual('caddis');
  });

  it('returns undefined for a key in the queryString - Case Sensitive', function() {
    setSearch('?fly=caddis');
    expect(getQueryParam('Fly', false)).toBeUndefined();
  });

  it('returns a value for a key in the queryString - Case InSensitive', function() {
    setSearch('?fly=caddis');
    expect(getQueryParam('Fly', true)).toEqual('caddis');
  });

  it('returns undefined for an unknown key in the queryString', function() {
    setSearch('?fly=caddis');
    expect(getQueryParam('nymph', true)).toBeUndefined();
  });

  it('returns a value for specific key when multiple keys exist in the queryString', function() {
    setSearch('?fly=caddis&nymph=RS2');
    expect(getQueryParam('nymph', true)).toEqual('RS2');
  });
});
