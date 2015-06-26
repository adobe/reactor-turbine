var isNumber = require('../isNumber');

var letters = ['A', 'B', 'C'];
var strings = 'I need help';
var funk = function () {
  var c = 'Superman';
};

describe('isNumber', function() {
  it('returns true if the object is a number', function() {

    expect(isNumber(5)).toBe(true);
  });

  it('returns false if the object is a string', function() {
    expect(isNumber(strings)).toBe(false);
  });

  it('returns false if the object is a function', function() {
    expect(isNumber(funk)).toBe(false);
  });
});
