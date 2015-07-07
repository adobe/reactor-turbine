var keys = require('../keys');

var target = {a: 'apple', b: 'banana', c: 'cucumber'};

describe('keys', function() {
  it('returns array of keys', function() {
    var res = keys(target);
    expect(res).toEqual(['a', 'b', 'c']);
  });
});
