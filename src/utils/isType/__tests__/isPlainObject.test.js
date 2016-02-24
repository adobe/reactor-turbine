var isObject = require('../isPlainObject');

describe('isObject', function() {
  it('returns true when the item is a regular object', function() {
    var objects = [
      Object.create({}),
      Object.create(Object.prototype),
      {foo: 'bar'},
      {}
    ];

    objects.forEach(function(item) {
      expect(isObject(item)).toBe(true);
    });
  });

  it('returns false when the item is not a regular object', function() {
    var Foo = function() {
      this.abc = {};
    };

    var nonObjects = [
      /foo/,
      function() {},
      1,
      ['foo', 'bar'],
      [],
      new Foo,
      null,
      Object.create(null)
    ];

    nonObjects.forEach(function(item) {
      expect(isObject(item)).toBe(false);
    });
  });
});
