'use strict';

var rewire = require('rewire');
var dataElementDelegate = rewire('../cookie');

dataElementDelegate.__set__('readCookie', function() { return 'bar'; });

describe('cookie data element delegate', function() {
  it('should return the value of a cookie', function() {
    var settings = {
      dataElementSettings: {
        name: 'foo'
      }
    };

    expect(dataElementDelegate(settings)).toBe('bar');
  });
});
