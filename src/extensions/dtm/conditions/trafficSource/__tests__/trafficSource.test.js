'use strict';

var mockVisitorTracking = {
  getTrafficSource: function() {
    return 'http://trafficsource.com';
  }
};

var conditionDelegateInjector = require('inject!../trafficSource');
var publicRequire = require('../../../../../engine/publicRequire');
var conditionDelegate = conditionDelegateInjector({
  'textMatch': publicRequire('textMatch'),
  'dtm/visitorTracking': mockVisitorTracking
});

describe('traffic source condition delegate', function() {
  it('returns true when the traffic source matches one of the string options', function() {
    var config = {
      conditionConfig: {
        sources: ['http://foo.com', 'http://trafficsource.com']
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the traffic source does not match one of the string options', function() {
    var config = {
      conditionConfig: {
        sources: ['http://foo.com', 'http://bar.com']
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when the traffic source matches a regex options', function() {
    var config = {
      conditionConfig: {
        sources: ['http://foo.com', /traffic.ource/i]
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the traffic source does not match the regex option', function() {
    var config = {
      conditionConfig: {
        sources: ['http://foo.com', /my\.yahoo\.com/i]
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });
});

