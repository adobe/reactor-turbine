var isObject = require('../isObject');

describe('isObject', function() {
  it('returns true if the object is an object', function() {
    var Funk = function() {};
    expect(isObject(new Funk())).toBe(true);
  });

  it('returns false if the object is a string', function() {
    expect(isObject('I need help')).toBe(false);
  });

  it('returns false if the object is a function', function() {
    expect(isObject(['A', 'B', 'C'])).toBe(false);
  });
});
