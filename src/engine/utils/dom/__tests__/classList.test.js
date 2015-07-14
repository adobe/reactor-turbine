var classList = require('../classList');

describe('classList', function() {
  var testElement;

  beforeAll(function() {
    testElement = document.createElement('p');
    testElement.id = 'test';
  });

  beforeEach(function() {
    testElement.className = '';
  });

  describe('add()', function() {
    // add tests
    it('returns a className when the className is not previously defined', function() {
      testElement.className = 'fooMan';
      classList.add(testElement, 'fooMan');
      expect(testElement.className).toEqual('fooMan');
    });

    it('appends the className if already defined, to the returned string', function() {
      testElement.className = 'fooMan';
      classList.add(testElement, 'fooBoy');
      expect(testElement.className).toEqual('fooMan fooBoy');
    });

    it('returns a className with a space when the className is not previously defined', function() {
      testElement.className = 'foo Man';
      classList.add(testElement, 'foo Man');
      expect(testElement.className).toEqual('foo Man');
    });

    it('returns TypeError if the target element is not a string.', function() {
      var throwsError = function() {
        classList.add({a: 'apple'}, 'some className');
      };
      expect(throwsError).toThrowError(TypeError);
    });
  });

  //contains tests
  describe('contains()', function() {
    it('returns null if the element does not have the specified className', function() {
      testElement.className = 'fooMan';
      expect(classList.contains(testElement, 'fooBoy')).toBeNull();
    });

    it('returns null if the className is NOT set.', function() {
      expect(classList.contains(testElement, 'className')).toBeNull();
    });

    it('returns null if the className is not a string.', function() {
      testElement.className = {a: 'apple'};
      expect(classList.contains(testElement, {a: 'apple'})).toBeNull();
    });
  });

  //toggle tests
  describe('toggle()', function() {
    it('adds the className if it does not exist.', function() {
      classList.toggle(testElement, 'fooMan');
      expect(testElement.className).toEqual(' fooMan');
    });

    it('removes the className if it already exists.', function() {
      testElement.className = 'fooMan';
      classList.toggle(testElement, 'fooMan');
      expect(testElement.className).toEqual('');
    });

    it('removes the className if multiples already exists.', function() {
      testElement.className = 'foo Man';
      classList.toggle(testElement, 'Man');
      expect(testElement.className).toEqual('foo ');

      classList.add(testElement, 'Man');
      expect(testElement.className).toEqual('foo  Man'); // double spaces

    });
  });

  describe('delete()', function() {
    it('removes the className if it already exists.', function() {
      testElement.className = 'fooMan';
      classList.remove(testElement, 'fooMan');
      expect(testElement.className).toEqual('');
    });

    it('removes only one if multiple classNames exists.', function() {
      testElement.className = 'foo Man';
      classList.remove(testElement, 'foo');
      expect(testElement.className).toEqual(' Man');
    });
  });
});
