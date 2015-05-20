var forEach = require('../forEach');

describe('forEach', function() {
  it('calls a function for each item in an array', function() {
    var letters = ['A', 'B', 'C'];

    var handler = jasmine.createSpy();

    forEach(letters, handler);

    expect(handler.calls.count()).toBe(3);
    expect(handler.calls.argsFor(0)).toEqual(['A', 0, letters]);
    expect(handler.calls.argsFor(1)).toEqual(['B', 1, letters]);
    expect(handler.calls.argsFor(2)).toEqual(['C', 2, letters]);
  });
});
