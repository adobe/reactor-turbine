var indexOf = require('../indexOf');

describe('indexOf', function() {
  it('returns the index of an item in an array', function() {
    var letters = ['A', 'B', 'C'];
    var index = indexOf(letters, 'B');

    expect(index).toBe(1);
  });
});
