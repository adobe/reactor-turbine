'use strict';

describe('getLocalStorageItem', function() {
  it('returns a local storage item', function() {
    var getLocalStorageItem = require('../getLocalStorageItem');

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

    var getLocalStorageItem = require('inject!../getLocalStorageItem')({
      window: mockWindow
    });

    expect(getLocalStorageItem('foo')).toBeNull();
  });
});
