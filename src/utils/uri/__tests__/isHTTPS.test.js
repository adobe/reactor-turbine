'use strict';

var mockDocument = {
  location: {
    pathname: '/flyFishers.php',
    search: '',
    protocol: 'http'
  }
};

var isHTTPS = require('inject!../isHTTPS')({
  document: mockDocument
});

var setProtocol = function(protocol) {
  mockDocument.location.protocol = protocol;
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
