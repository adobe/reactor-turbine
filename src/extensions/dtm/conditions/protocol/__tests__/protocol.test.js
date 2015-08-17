'use strict';

var conditionDelegate = require('../protocol');

describe('protocol condition delegate', function() {
  it('returns true when the browser protocol matches', function() {
    var config = {
      conditionConfig: {
        protocols: [/bogus:/i, /http:/i]
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the browser protocol does not match', function() {
    var config = {
      conditionConfig: {
        protocols: [/bogus:/i, /foo:/i]
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });
});
