describe('createDataStash', function() {
  var createDataStash;

  beforeAll(function() {
    createDataStash = require('../createDataStash');
  });

  it('stores data for an object that does not collide with data from other stashes', function() {
    var host = {};

    var stashA = createDataStash();
    var dataFromStashA = stashA(host);
    dataFromStashA.foo = 'bar';

    var stashB = createDataStash();
    var dataFromStashB = stashB(host);
    dataFromStashB.foo = 'unicorn';

    expect(stashA(host).foo).toBe('bar');
    expect(stashB(host).foo).toBe('unicorn');
  });

  // Although this is basically testing implementation details, we do allow the consumer to provide
  // a data stash name that allows them to more easily find their stash when debugging.
  it('stores data at __turbine__ using stash name', function() {
    var host = {};

    var stash = createDataStash('stashName');
    var data = stash(host);
    data.foo = 'bar';

    var storedData;

    Object.keys(host.__turbine__).forEach(function(key) {
      if (key.indexOf('stashName') === 0) {
        storedData = host.__turbine__[key];
        return false;
      }
    });

    expect(storedData).toBeDefined();
    expect(storedData.foo).toBe('bar');
  });
});
