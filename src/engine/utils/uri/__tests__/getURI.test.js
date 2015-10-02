'use strict';

var mockDocument = {
  location: {
    pathname: '',
    search: '',
    protocol: 'http:'
  }
};

var getURI = require('inject!../getURI')({
  document: mockDocument
});

var setLocation = function(pathname, search) {
  mockDocument.location.pathname = pathname;
  mockDocument.location.search = search;
};

describe('getURI', function() {

  it('returns the correct path with no search parameters', function() {
    setLocation('/flyFishers.php', '');
    expect(getURI()).toEqual('/flyFishers.php');
  });

  it('returns the correct concatenated path with one search parameters', function() {
    setLocation('/flyFishers.php', '?dryFly=caddis');
    expect(getURI()).toEqual('/flyFishers.php?dryFly=caddis');
  });

  it('returns the correct concatenated path with multiple search parameters', function() {
    setLocation('/flyFishers.php', '?dryFly=caddis&timeOfDay=morning');
    expect(getURI()).toEqual('/flyFishers.php?dryFly=caddis&timeOfDay=morning');
  });

  it('returns the correct concatenated path with / pathname', function() {
    setLocation('/', '?dryFly=BWO');
    expect(getURI()).toEqual('/?dryFly=BWO');
  });

  it('returns the correct concatenated path with empty pathname', function() {
    setLocation('', '?dryFly=PMD');
    expect(getURI()).toEqual('?dryFly=PMD');
  });
});
