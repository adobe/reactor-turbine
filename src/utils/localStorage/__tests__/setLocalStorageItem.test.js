'use strict';

var setLocalStorageItem = require('../setLocalStorageItem');

describe('setLocalStorageItem', function() {
  it('sets and returns item', function() {
    setLocalStorageItem('foo', 'something');
    expect(window.localStorage.getItem('foo')).toEqual('something');
  });

  it('proper error handling if Local Storage is disabled', function() {
    var mockWindow = {
      localStorage: {
        setItem: function() {
          throw Error('Test error');
        }
      }
    };

    var mockSetLocalStorageItem = require('inject!../setLocalStorageItem')({
      window: mockWindow
    });

    mockSetLocalStorageItem('thing', 'something');

    expect(window.localStorage.getItem('thing')).toBeNull();
  });
});
