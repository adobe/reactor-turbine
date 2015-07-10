'use strict';

var rewire = require('rewire');
var isHTTPS = rewire('../isHTTPS');
var setProtocol = function(protocol) {
  isHTTPS.__set__({
    document: {
      location: {
        pathname: '/flyFishers.php',
        search: '',
        protocol: protocol
      }
    }
  });
};

describe('isHTTPS', function() {
  it('returns true if the protocol is https', function() {
    setProtocol('https:');
    expect(isHTTPS()).toBe(true);
  });

  it('returns false if the protocol is http', function() {
    setProtocol('http:');
    expect(isHTTPS()).toBe(false);
  });
});
