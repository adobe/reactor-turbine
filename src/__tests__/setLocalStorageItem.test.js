'use strict';

describe('setLocalStorageItem', function() {
  it('sets and returns item', function() {
    // Mocking window because Safari throws an error when setting a local storage item in Private
    // Browser Mode.
    var mockWindow = {
      localStorage: {
        setItem: function(key, value) {
          this[key] = value;
        },
        getItem: function(key) {
          return this[key];
        }
      }
    };

    var setLocalStorageItem = require('inject!../setLocalStorageItem')({
      window: mockWindow
    });

    setLocalStorageItem('foo', 'something');
    expect(mockWindow.localStorage.getItem('foo')).toEqual('something');
  });

  it('proper error handling if Local Storage is disabled', function() {
    var mockWindow = {
      localStorage: {
        setItem: function() {
          throw Error('Test error');
        }
      }
    };

    var setLocalStorageItem = require('inject!../setLocalStorageItem')({
      window: mockWindow
    });

    setLocalStorageItem('thing', 'something');

    expect(window.localStorage.getItem('thing')).toBeNull();
  });
});
