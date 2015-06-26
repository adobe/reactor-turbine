var isNumber = require('../isNumber');

describe('isNumber', function() {
  it('returns true if the object is a number', function() {
    expect(isNumber(5)).toBe(true);
  });

  it('returns false if the object is a string', function() {
    expect(isNumber('I need help')).toBe(false);
  });

  it('returns false if the object is a function', function() {
    expect(isNumber(function() {})).toBe(false);
  });
});
