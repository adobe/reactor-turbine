var isFunction = require('../isFunction');

var letters = ['A', 'B', 'C'];
var strings = 'I need help';
var funk = function () {
  var c = 'Superman';
};

describe('isFunction', function() {
  it('returns true if the object is a function', function() {

    expect(isFunction(funk)).toBe(true);
  });

  it('returns false if the object is s string', function() {
    expect(isFunction(strings)).toBe(false);
  });

  it('returns false if the object is an array', function() {
    expect(isFunction(letters)).toBe(false);
  });
});
