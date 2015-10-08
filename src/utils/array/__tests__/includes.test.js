'use strict';

var includes = require('../includes');
var letters = ['A', 'B', 'C'];

describe('includes', function() {
  it('returns true when item is in array', function() {
    expect(includes(letters, 'B')).toBe(true);
  });

  it('returns false when item is not in array', function() {
    expect(includes(letters, 'D')).toBe(false);
  });
});
