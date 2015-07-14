var classList = require('../classList');
var testElement;

describe('classList', function() {
  // add tests
  it('add: returns a className when the className is not defined', function() {
    testElement = document.createElement('p');
    testElement.id = 'test';
    document.body.appendChild(testElement);

    classList.add(testElement, 'fooMan');
    expect(testElement.className).toEqual(' fooMan');
  });

  it('add: appends the className if already defined to the returned string', function() {
    testElement = document.createElement('p');
    testElement.id = 'test';
    testElement.className = 'fooMan';
    document.body.appendChild(testElement);

    classList.add(testElement, 'fooBoy');
    expect(testElement.className).toEqual('fooMan fooBoy');
  });

  it('add: returns a className with a space when the className is not defined', function() {
    testElement = document.createElement('p');
    testElement.id = 'test';
    testElement.className = 'foo Man';
    document.body.appendChild(testElement);

    classList.add(testElement, 'foo Man');
    expect(testElement.className).toEqual('foo Man');
  });

  it('add: returns TypeError if the target element is not a string.', function() {
    var throwsError = function() {
      classList.add({a: 'apple'}, 'some className');
    };
    expect(throwsError).toThrowError(TypeError);
  });

  //contains tests
  it('contains: returns null if the element does not have the specified className', function() {
    testElement = document.createElement('p');
    testElement.id = 'test';
    testElement.className = 'fooMan';
    document.body.appendChild(testElement);

    expect(classList.contains(testElement, 'fooBoy')).toBeNull();
  });

  it('contains: returns null if the className is NOT set.', function() {
    testElement = document.createElement('div');
    testElement.id = 'test';

    expect(classList.contains(testElement, 'className')).toBeNull();
  });

  it('contains: returns null if the className is not a string.', function() {
    testElement = document.createElement('div');
    testElement.id = 'test';
    testElement.className = {a: 'apple'};

    expect(classList.contains(testElement, {a: 'apple'})).toBeNull();
  });

  //toggle tests
  it('toggle: adds the className if it does not exist.', function() {
    testElement = document.createElement('p');
    testElement.id = 'test';
    document.body.appendChild(testElement);

    classList.toggle(testElement, 'fooMan');
    expect(testElement.className).toEqual(' fooMan');
  });

  it('toggle: removes the className if it already exists.', function() {
    testElement = document.createElement('p');
    testElement.id = 'test';
    testElement.className = 'fooMan';
    document.body.appendChild(testElement);

    classList.toggle(testElement, 'fooMan');
    expect(testElement.className).toEqual('');
  });

  it('toggle: removes the className if multiples already exists.', function() {
    testElement = document.createElement('p');
    testElement.id = 'test';
    testElement.className = 'foo Man';
    document.body.appendChild(testElement);

    classList.toggle(testElement, 'Man');
    expect(testElement.className).toEqual('foo ');

    classList.add(testElement, 'Man');
    expect(testElement.className).toEqual('foo  Man'); // double spaces

  });

  // remove tests
  it('remove: removes the className if it already exists.', function() {
    testElement = document.createElement('p');
    testElement.id = 'test';
    testElement.className = 'fooMan';
    document.body.appendChild(testElement);

    classList.remove(testElement, 'fooMan');
    expect(testElement.className).toEqual('');
  });

  it('remove: removes only one if multiple classNamesexists.', function() {
    testElement = document.createElement('p');
    testElement.id = 'test';
    testElement.className = 'foo Man';
    document.body.appendChild(testElement);

    classList.remove(testElement, 'foo');
    expect(testElement.className).toEqual(' Man');
  });


});
