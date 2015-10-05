var isString = require('../isString');

describe('isString', function() {
  it('returns true if the object is a string', function() {
    expect(isString('I need help')).toBe(true);
  });

  it('returns false if the object is an array', function() {
    expect(isString(['A', 'B', 'C'])).toBe(false);
  });

  it('returns false if the object is a function', function() {
    expect(isString(function() {})).toBe(false);
  });
});
