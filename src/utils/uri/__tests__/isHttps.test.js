'use strict';

var mockDocument = {
  location: {
    pathname: '/flyFishers.php',
    search: '',
    protocol: 'http'
  }
};

var isHttps = require('inject!../isHttps')({
  document: mockDocument
});

var setProtocol = function(protocol) {
  mockDocument.location.protocol = protocol;
};

describe('isHttps', function() {
  it('returns true if the protocol is https', function() {
    setProtocol('https:');
    expect(isHttps()).toBe(true);
  });

  it('returns false if the protocol is http', function() {
    setProtocol('http:');
    expect(isHttps()).toBe(false);
  });
});
