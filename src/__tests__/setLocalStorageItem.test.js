'use strict';

describe('setLocalStorageItem', function() {
  it('sets and returns item', function() {
    var setLocalStorageItem = require('../setLocalStorageItem');

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

    var setLocalStorageItem = require('inject!../setLocalStorageItem')({
      window: mockWindow
    });

    setLocalStorageItem('thing', 'something');

    expect(window.localStorage.getItem('thing')).toBeNull();
  });
});
