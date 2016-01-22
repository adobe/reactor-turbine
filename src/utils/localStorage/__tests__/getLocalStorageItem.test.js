'use strict';

var getLocalStorageItem = require('../getLocalStorageItem');

describe('getLocalStorageItem', function() {
  it('returns and removes set item', function() {
    window.localStorage.setItem('foo', 'something');
    expect(getLocalStorageItem('foo')).toEqual('something');

    window.localStorage.removeItem('foo');
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

    var mockGetLocalStorageItem = require('inject!../getLocalStorageItem')({
      window: mockWindow
    });

    expect(mockGetLocalStorageItem('foo')).toBeNull();
  });
});
