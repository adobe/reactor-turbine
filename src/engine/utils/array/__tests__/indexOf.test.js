'use strict';

var indexOf = require('../indexOf');

var letters = ['A', 'B', 'C'];

describe('indexOf', function() {
  it('returns the index of an item in an array', function() {
    expect(indexOf(letters, 'B')).toBe(1);
  });

  it('returns -1 if an item is not in an array', function() {
    expect(indexOf(letters, 'D')).toBe(-1);
  });
});
