var isArray = require('../isArray');

var letters = ['A', 'B', 'C'];
var strings = 'I need help';
var funk = function () {
  var c = 'Superman';
};

describe('isArray', function() {
  it('returns true if the object is an array', function() {

    expect(isArray(letters)).toBe(true);
  });

  it('returns false if the object is a string', function() {
    expect(isArray(strings)).toBe(false);
  });

  it('returns false if the object is a function', function() {
    expect(isArray(funk)).toBe(false);
  });
});
