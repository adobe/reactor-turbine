'use strict';

var publicRequire = require('../../../../engine/publicRequire');
var conditionDelegate = require('inject!../urlParameter')({
  textMatch: publicRequire('textMatch'),
  getQueryParam: function() {
    return 'foo';
  }
});

describe('url parameter condition delegate', function() {
  it('returns true when value matches using regular string', function() {
    var config = {
      conditionConfig: {
        name: 'testParam',
        value: 'foo'
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns true when value matches using regex', function() {
    var config = {
      conditionConfig: {
        name: 'testParam',
        value: /^f[ojd]o$/
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when value does not match using regular string', function() {
    var config = {
      conditionConfig: {
        name: 'testParam',
        value: 'goo'
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns false when value does not match using regex', function() {
    var config = {
      conditionConfig: {
        name: 'testParam',
        value: /^g[ojd]o$/
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });
});
