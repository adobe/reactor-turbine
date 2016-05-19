var EventEmitter = require('../EventEmitter');

describe('EventEmitter', function() {
  describe('mixin', function() {
    it('should extend existing constructors functions', function() {
      var fn = function() {};
      EventEmitter.mixin(fn);

      var instance = new fn();
      expect(instance.on).toEqual(jasmine.any(Function));
      expect(instance.off).toEqual(jasmine.any(Function));
      expect(instance.emit).toEqual(jasmine.any(Function));
    });

    it('should extend existing object', function() {
      var instance = {};
      EventEmitter.mixin(instance);

      expect(instance.on).toEqual(jasmine.any(Function));
      expect(instance.off).toEqual(jasmine.any(Function));
      expect(instance.emit).toEqual(jasmine.any(Function));
    });
  });
});
