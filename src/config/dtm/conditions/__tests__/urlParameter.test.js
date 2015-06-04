var rewire = require('rewire');
var urlParamCondition = rewire('../urlParameter');

urlParamCondition.__set__('textMatch', require('../../../../engine/utils/string/textMatch'));
urlParamCondition.__set__('getQueryParam', function() {
  return 'foo';
});

describe('url parameter condition', function() {
  it('returns true when value matches using regular string', function() {
    var settings = {
      name: 'testParam',
      value: 'foo'
    };

    expect(urlParamCondition(settings)).toBe(true);
  });

  it('returns true when value matches using regex', function() {
    var settings = {
      name: 'testParam',
      value: /^f[ojd]o$/
    };

    expect(urlParamCondition(settings)).toBe(true);
  });

  it('returns false when value does not match using regular string', function() {
    var settings = {
      name: 'testParam',
      value: 'goo'
    };

    expect(urlParamCondition(settings)).toBe(false);
  });

  it('returns false when value does not match using regex', function() {
    var settings = {
      name: 'testParam',
      value: /^g[ojd]o$/
    };

    expect(urlParamCondition(settings)).toBe(false);
  });
});
