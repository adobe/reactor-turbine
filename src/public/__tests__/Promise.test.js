describe('Promise', function() {
  it('returns the native Promise constructor if it exists', function() {
    var mockNativePromise = function() {};
    var mockWindow = {
      Promise: mockNativePromise
    };

    var Promise = require('inject!../Promise')({
      'window': mockWindow
    });

    expect(Promise).toBe(mockNativePromise);
  });

  it('returns a Promise constructor implementation if a native one does not exist', function() {
    var mockWindow = {};

    var Promise = require('inject!../Promise')({
      'window': mockWindow
    });

    expect(Promise).toEqual(jasmine.any(Function));
  });
});
