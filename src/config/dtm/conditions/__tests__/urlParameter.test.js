var rewire = require('rewire');
var conditionDelegate = rewire('../urlParameter');

conditionDelegate.__set__('textMatch', require('../../../../engine/utils/string/textMatch'));
conditionDelegate.__set__('getQueryParam', function() {
  return 'foo';
});

describe('url parameter condition delegate', function() {
  it('returns true when value matches using regular string', function() {
    var settings = {
      name: 'testParam',
      value: 'foo'
    };

    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns true when value matches using regex', function() {
    var settings = {
      name: 'testParam',
      value: /^f[ojd]o$/
    };

    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when value does not match using regular string', function() {
    var settings = {
      name: 'testParam',
      value: 'goo'
    };

    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns false when value does not match using regex', function() {
    var settings = {
      name: 'testParam',
      value: /^g[ojd]o$/
    };

    expect(conditionDelegate(settings)).toBe(false);
  });
});
