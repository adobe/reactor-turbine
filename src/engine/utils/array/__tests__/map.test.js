var map = require('../map');

var letters = ['A', 'B', 'C'];

describe('map', function() {
  it('creates a new array with the results of calling a provided function for every element in an array', function() {
    var result = map(letters, function(letter) {
      return letter += 'X';
    });

    expect(result).toEqual(['AX', 'BX', 'CX']);
  });

  it('calls a provided function with a specified context', function() {
    var handler = jasmine.createSpy();
    var context = {};

    map(letters, handler, context);

    expect(handler.calls.first().object).toBe(context);
  });
});
