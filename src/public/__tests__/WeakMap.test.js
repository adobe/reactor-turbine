describe('WeakMap', function() {
  it('returns the native WeakMap if it exists', function() {
    var MockWeakMap = function() {};
    var mockWindow = {
      WeakMap: MockWeakMap
    };

    var WeakMap = require('inject!../WeakMap')({
      'window': mockWindow
    });

    expect(WeakMap).toBe(MockWeakMap);
  });

  it('returns WeakMap implementation without modifying global scope', function() {
    var mockWindow = {};

    var WeakMap = require('inject!../WeakMap')({
      'window': mockWindow
    });

    expect(WeakMap).toEqual(jasmine.any(Function));
    expect(mockWindow.WeakMap).toBeUndefined();
  });

  // Tests below are derived from
  // https://github.com/webcomponents/webcomponentsjs/blob/82964dec42a7f6af70142b1bbf3bc4ca16bf1bcf/tests/WeakMap/tests.html

  it('has get, set, delete, and has functions', function() {
    var WeakMap = require('../WeakMap');
    expect(WeakMap.prototype.get).toEqual(jasmine.any(Function));
    expect(WeakMap.prototype.set).toEqual(jasmine.any(Function));
    expect(WeakMap.prototype.delete).toEqual(jasmine.any(Function));
    expect(WeakMap.prototype.has).toEqual(jasmine.any(Function));
  });

  it('has methods that perform as expected', function() {
    var WeakMap = require('../WeakMap');
    var wm = new WeakMap();

    var o1 = {};
    var o2 = function() {};
    var o3 = window;

    // IE 11 WeakMap does not chain
    if (wm.name || !/Trident/.test(navigator.userAgent)) {
      wm.set(o1, 37).set(o2, 'aoeui');
    } else {
      wm.set(o1, 37);
      wm.set(o2, 'aoeui');
    }

    expect(wm.get(o1)).toBe(37);
    expect(wm.get(o2)).toBe('aoeui');

    wm.set(o1, o2);
    wm.set(o3, undefined);

    expect(wm.get(o1)).toBe(o2);
    // `wm.get({})` should return undefined, because there is no value for
    // the object on wm
    expect(wm.get({})).toBeUndefined();
    // `wm.get(o3)` should return undefined, because that is the set value
    expect(wm.get(o3)).toBeUndefined();

    expect(wm.has(o1)).toBe(true);
    expect(wm.has({})).toBe(false);

    wm.delete(o1);
    expect(wm.get(o1)).toBeUndefined();
    expect(wm.has(o1)).toBe(false);
    // Ensure that delete returns true/false indicating if the value was removed
    expect(wm.delete(o2)).toBe(true);
    expect(wm.delete({})).toBe(false);
  });
});
