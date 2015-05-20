var includes = require('../includes');

describe('includes', function() {
  it('returns true when item is in array', function () {
    var letters = ['A', 'B', 'C'];
    var included = includes(letters, 'B');

    expect(included).toBe(true);
  });
});
