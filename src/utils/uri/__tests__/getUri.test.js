'use strict';

var mockDocument = {
  location: {
    pathname: '',
    search: '',
    protocol: 'http:'
  }
};

var getUri = require('inject!../getUri')({
  document: mockDocument
});

var setLocation = function(pathname, search) {
  mockDocument.location.pathname = pathname;
  mockDocument.location.search = search;
};

describe('getUri', function() {

  it('returns the correct path with no search parameters', function() {
    setLocation('/flyFishers.php', '');
    expect(getUri()).toEqual('/flyFishers.php');
  });

  it('returns the correct concatenated path with one search parameters', function() {
    setLocation('/flyFishers.php', '?dryFly=caddis');
    expect(getUri()).toEqual('/flyFishers.php?dryFly=caddis');
  });

  it('returns the correct concatenated path with multiple search parameters', function() {
    setLocation('/flyFishers.php', '?dryFly=caddis&timeOfDay=morning');
    expect(getUri()).toEqual('/flyFishers.php?dryFly=caddis&timeOfDay=morning');
  });

  it('returns the correct concatenated path with / pathname', function() {
    setLocation('/', '?dryFly=BWO');
    expect(getUri()).toEqual('/?dryFly=BWO');
  });

  it('returns the correct concatenated path with empty pathname', function() {
    setLocation('', '?dryFly=PMD');
    expect(getUri()).toEqual('?dryFly=PMD');
  });
});
