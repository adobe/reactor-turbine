var isArray = require('../isArray');

describe('isArray', function() {
  it('returns true if the object is an array', function() {
    expect(isArray(['A', 'B', 'C'])).toBe(true);
  });

  it('returns false if the object is a string', function() {
    expect(isArray('I need help')).toBe(false);
  });

  it('returns false if the object is a function', function() {
    expect(isArray(function() {})).toBe(false);
  });
});
