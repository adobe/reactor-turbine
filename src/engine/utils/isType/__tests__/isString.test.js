var isString = require('../isString');

var letters = ['A', 'B', 'C'];
var strings = 'I need help';
var funk = function () {
  var c = 'Superman';
};

describe('isString', function() {
  it('returns true if the object is a string', function() {

    expect(isString(strings)).toBe(true);
  });

  it('returns false if the object is an array', function() {
    expect(isString(letters)).toBe(false);
  });

  it('returns false if the object is a function', function() {
    expect(isString(funk)).toBe(false);
  });
});
