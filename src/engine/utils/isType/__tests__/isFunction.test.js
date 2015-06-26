var isFunction = require('../isFunction');

describe('isFunction', function() {
  it('returns true if the object is a function', function() {
    expect(isFunction(function() {})).toBe(true);
  });

  it('returns false if the object is s string', function() {
    expect(isFunction('I need help')).toBe(false);
  });

  it('returns false if the object is an array', function() {
    expect(isFunction(['A', 'B', 'C'])).toBe(false);
  });
});
