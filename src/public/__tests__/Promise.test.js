describe('Promise', function() {
  var clearRequireCache = function() {
    delete require.cache[require.resolve('../Promise')];
    delete require.cache[require.resolve('native-promise-only-ponyfill')];
  };

  beforeEach(clearRequireCache);

  afterAll(clearRequireCache);

  it('returns native promise if available', function() {
    var originalPromise = window.Promise;
    var mockPromise = {};
    window.Promise = mockPromise;
    var Promise = require('../Promise');

    expect(Promise).toBe(mockPromise);

    window.Promise = originalPromise;
  });

  it('returns ponyfill promise if native promise not available', function() {
    var originalPromise = window.Promise;
    window.Promise = undefined;
    var Promise = require('../Promise');

    expect(Promise).toEqual(jasmine.any(Function));
    expect(Promise).not.toBe(originalPromise);
    expect(window.Promise).toBeUndefined();

    window.Promise = originalPromise;
  });
});
