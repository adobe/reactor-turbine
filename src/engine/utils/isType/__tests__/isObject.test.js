var isObject = require('../isObject');

var letters = ['A', 'B', 'C'];
var strings = 'I need help';
var funk = function () {
  var c = 'Superman';
};

var obj = new funk();

describe('isObject', function() {
  it('returns true if the object is an object', function() {

    expect(isObject(obj)).toBe(true);
  });

  it('returns false if the object is a string', function() {
    expect(isObject(strings)).toBe(false);
  });

  it('returns false if the object is a function', function() {
    expect(isObject(funk)).toBe(false);
  });
});
