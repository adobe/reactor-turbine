var forEach = require('../forEach');

var letters = ['A', 'B', 'C'];

describe('forEach', function() {
  it('calls a provided function for each item in an array', function() {
    var handler = jasmine.createSpy();

    forEach(letters, handler);

    expect(handler.calls.count()).toBe(3);
    expect(handler.calls.argsFor(0)).toEqual(['A', 0, letters]);
    expect(handler.calls.argsFor(1)).toEqual(['B', 1, letters]);
    expect(handler.calls.argsFor(2)).toEqual(['C', 2, letters]);
  });

  it('calls a provided function with a specified context', function() {
    var handler = jasmine.createSpy();
    var context = {};

    forEach(letters, handler, context);

    expect(handler.calls.first().object).toBe(context);
  });
});
