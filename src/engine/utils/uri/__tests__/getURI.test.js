'use strict';

var rewire = require('rewire');
var getURI = rewire('../getURI');
var setLocation = function(pathname, search) {
  getURI.__set__({
    document: {
      location: {
        pathname: pathname,
        search: search,
        protocol: 'http:'
      }
    }
  });
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
