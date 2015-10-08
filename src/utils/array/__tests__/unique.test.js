'use strict';

var unique = require('../unique');

describe('unique', function() {
  it('works with numbers', function() {
    expect(unique([1,1,2,3,5,1])).toEqual([1,2,3,5]);
  });

  it('works with strings', function() {
    expect(unique(['a', 'Z', 'A', 'a'])).toEqual(['a', 'Z', 'A']);
  });

  it('works with booleans', function() {
    expect(unique([true, false, false, true])).toEqual([true, false]);
  });

  it('works with null', function() {
    expect(unique([1, null, 'a', null])).toEqual([1, null, 'a']);
  });
});
