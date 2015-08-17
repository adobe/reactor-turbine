'use strict';

var mockDocument = {
  location: {
    hostname: 'foo.adobe.com'
  }
};

var conditionDelegateInjector = require('inject!../domain');
var conditionDelegate = conditionDelegateInjector({
  document: mockDocument
});

describe('domain condition delegate', function() {
  it('returns true when the domain matches', function() {
    var config = {
      conditionConfig: {
        domains: [/example\.com$/i, /adobe\.com$/i]
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the domain does not match', function() {
    var config = {
      conditionConfig: {
        domains: [/example\.com$/i, /yahoo\.com$/i]
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });
});
