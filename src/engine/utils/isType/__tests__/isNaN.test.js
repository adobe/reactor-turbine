var isNan = require('../isNaN');

var letters = ['A', 'B', 'C'];
var strings = 'I need help';

describe('isNaN', function() {
  it('returns true if the object is NaN', function() {

    expect(isNan(NaN)).toBe(true);
  });

  it('returns false if the object is a string', function() {
    expect(isNan(strings)).toBe(false);
  });

  it('returns false if the object is an Array', function() {
    expect(isNan(letters)).toBe(false);
  });
});
